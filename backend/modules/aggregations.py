import re
from modules.instructions import get_meta_data

schema_metadata = schema_metadata = get_meta_data("meta.json")

def translate_operator(op):
    """Translate operator to SQL operator."""
    operator_map = {
        "EQUALS": "=",
        "BELOW": "<",
        "ABOVE": ">",
        "IN": "IN",
        "BETWEEN": "BETWEEN",
        "NOT": "NOT"
    }
    return operator_map.get(op, None)

def validate_column_and_condition(column, condition, column_type):
    """Validate if a condition is compatible with the column and its datatype."""
    condition_operator, value = condition

    # Ensure that the operator is valid for this column's type
    if condition_operator not in column_type["possible_condition_flags"]:
        raise ValueError(f"Invalid operator '{condition_operator}' for column '{column}'.")

    # If the operator is :in or :bw, handle array values and range check
    if condition_operator == "IN":
        # Ensure value is an array and all elements are of the correct datatype
        if not isinstance(value, list):
            raise ValueError(f"The value for 'IN' operator must be a list of values.")
        for v in value:
            if not isinstance(v, int):
                raise ValueError(f"Value '{v}' in IN operator must match the column's datatype.")
    elif condition_operator == "BETWEEN":
        # Ensure value is a tuple with two values, and they are in increasing order
        if not isinstance(value, tuple) or len(value) != 2 :
            raise ValueError("The value for 'BETWEEN' operator must be a tuple with two values.")
        if not isinstance(value[0], int) or not isinstance(value[0], int) or value[0] >= value[1]:
            raise ValueError("For 'BETWEEN' operator, the first value must be less than the second value.")
    else:
        # Ensure other conditions have a single value
        if not isinstance(value, int if column_type["datatype"] == "INT" else str):
            raise ValueError(f"Condition value '{value}' must match the column's datatype.")

def parse_aggregations(user_input):
    """
    Parse user input for aggregation functions (SUM, AVG, COUNT) and handle conditions using HAVING clause.
    """
    # Step 1: Match input with regex and extract sections
    pattern = r"^Provide\s+me\s+data\s+on\s+(\w+)\s+of\s+(\w+)\s*(?:\s+for\s+each\s+(\w+)\s*(?:\s+whose\s+\1\s+of\s+\2\s(NOT\s+|\s*)(\w+)\s+(\[.*?\]|\S+))?)?\s+in\s+(\w+)$"
    match = re.match(pattern, user_input)
    if not match:
        raise ValueError("Invalid input format. Expected: Provide me data on SUM of loan_amount for each loan_status whose SUM of loan_amount ABOVE 10000 in table_name")

    func, column, group_by_column , flag , condition_operator , condition_value, table_name = match.groups()

    # Validate aggregation function
    func = func.upper()
    if func not in {"SUM", "AVG", "COUNT","MAX","MIN"}:
        raise ValueError(f"Invalid aggregation function '{func}'. Supported: SUM, AVG, COUNT.")
    
    # Validate column for aggregation
    column_info = schema_metadata.get(column)
    if not column_info:
        raise ValueError(f"Invalid column '{column}' for aggregation.")
    
    # Validate group_by column is different from aggregation column
    if group_by_column :
        if group_by_column == column:
            raise ValueError(f"GroupBy column '{group_by_column}' must be different from the aggregated column '{column}'.")
    
    if func in ["SUM", "AVG" ,"MIN", "MAX"] and column_info["datatype"] not in ["INT","DECIMAL"] :
        raise ValueError(f"Invalid aggregation on '{column}' try 'COUNT' for aggregation.")
    
    if func and column_info["datatype"] == "DATE" :
        raise ValueError(f"Invalid aggregation on '{column}' No aggregation available.")

    # Validate condition and value if present
    condition = None
    if condition_operator:
        # Parse the condition value based on the condition operator
        if condition_operator == "IN":
            condition_value = eval(condition_value)
        elif condition_operator == "BETWEEN":
            # For :bw, the value is expected to be a tuple (e.g., (1, 10))
            if condition_value[0]=='[' and condition_value[-1]==']':
                condition_value = tuple(map(int, condition_value[1:-1].split(",")))
            else :
                raise ValueError(f"Invalid value input for BETWEEN [start,end].")

        else:
            # For other operators, treat it as a single value
            condition_value = int(condition_value) if column_info["datatype"] == "INT" else condition_value

        condition = (condition_operator, condition_value)

        # Validate the condition with respect to the column's datatype
        validate_column_and_condition(column, condition, column_info)

    # Validate group_by column
    if group_by_column :
        group_by_column_info = schema_metadata.get(group_by_column)
        if not group_by_column_info:
            raise ValueError(f"Invalid GroupBy column '{group_by_column}'.")

    # Step 2: Build final query with GROUP BY and HAVING
        group_by_clause = f"GROUP BY {group_by_column}"
        group_by_column += " ,"
    else :
        group_by_clause = ""
        group_by_column = ""
    
    aggregation_func = func + "(" + column + ")"
    having_clause = ""

    if flag == None :
        flag = ""

    if condition:
        having_clause = f"HAVING "
        if isinstance(condition_value, list):  # For :in, the value is a list
            having_clause += f"{func}({column}) {flag} IN [{', '.join(map(str, condition_value))}]"
        elif isinstance(condition_value, tuple):  # For :bw, the value is a tuple
            having_clause += f"{func}({column}) {flag} BETWEEN {condition_value[0]} AND {condition_value[1]}"
        else:  # Single value condition
            having_clause += f"{flag} {func}({column}) {translate_operator(condition_operator)} {condition_value}"

    query = f"SELECT {group_by_column} {aggregation_func} FROM {table_name} {group_by_clause} {having_clause}"    
    
    return query

