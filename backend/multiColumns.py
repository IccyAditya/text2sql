import re
from modules.instructions import get_meta_data

schema_metadata = get_meta_data("meta.json")

def translate_operator(op):
    """Translate user-friendly operator to SQL operator."""
    operator_map = {
        "EQUALS": "=",
        "BELOW": "<",
        "ABOVE": ">",
        "IN": "IN",
        "BETWEEN": "BETWEEN",
        "NOT": "NOT"
    }
    return operator_map.get(op, None)

def validate_value(value, datatype, operator):
    """Validate value based on datatype and operator."""
    if operator in {"BETWEEN", "IN"}:
        if not isinstance(value, list):
            raise ValueError(f"Operator '{operator}' requires an array of values.")
        if operator == "BETWEEN" and len(value) != 2:
            raise ValueError(f"Operator 'BETWEEN' requires exactly two values.")
        if operator == "BETWEEN" and value[0] >= value[1]:
            raise ValueError(f"Invalid range '{value}'. Start value must be less than end value.")
    else:
        if isinstance(value, list):
            raise ValueError(f"Operator '{operator}' does not support array values.")
    if datatype == "INT":
        if operator in {"BETWEEN", "IN"}:
            if not all(isinstance(int(v), int) for v in value):
                raise ValueError(f"Invalid values '{value}' for INT column.")
        else:
            if not isinstance(int(v), int):
                raise ValueError(f"Invalid value '{value}' for INT column.")
    elif datatype == "VARCHAR":
        if operator in {"BETWEEN"}:
            raise ValueError(f"Operator ':BETWEEN' is not valid for VARCHAR type.")
        if operator in {"IN"}:
            if not all(isinstance(v, str) for v in value):
                raise ValueError(f"Invalid values '{value}' for VARCHAR column.")
        else:
            if not isinstance(value, str):
                raise ValueError(f"Invalid value '{value}' for VARCHAR column.")
    elif datatype == "DATE":
        if operator in {"IN", "BETWEEN"}:
            if not all(re.match(r"^\d{4}-\d{2}-\d{2}$", v) for v in value):
                raise ValueError(f"Invalid values '{value}' for DATE column.")
        else:
            if not re.match(r"^\d{4}-\d{2}-\d{2}$", value):
                raise ValueError(f"Invalid value '{value}' for DATE column.")

def parse_multiple_columns(user_input):
    """
    Parse user input for multiple columns and conditions, validate input, and build SQL query.
    """
    # Split input into DISPLAY, TABLE, and CONDITIONS sections
    pattern = r"^Provide\s+me\s+data\s+of\s+(\w+)\s*(?:whose\s+(.+?))?\s*(?:only\s+include\s+(.+))?$"

    # Perform the regex match
    match = re.match(pattern, user_input)

    if not match:
        raise ValueError("Invalid input format. Expected: Provide me data of loans whose condition1 AND/OR condition2 only include column1,column2")

    # Extract captured groups
    table_name, conditions_section, display_section = match.groups()

    # Parse display columns
    if display_section :
        display_columns = [col.strip() for col in display_section.split(",")]
        for col in display_columns:
            if col not in schema_metadata:
                raise ValueError(f"Invalid feature '{col}'.")
        display_clause = ", ".join(display_columns)
    else :
        display_clause = "*"

    # Parse conditions with logical operators

    conditions = re.findall(r"(\w+)\s+(NOT\s+|\s*)(\w+)\s+(\[.*?\]|\S+)(?:\s*(AND|OR)\s*)?", conditions_section)
    if not conditions:
        raise ValueError("No valid conditions found in input.")

    where_clauses = []

    for i, (col, flag, op, val, logic) in enumerate(conditions):
        # Validate column
        if col not in schema_metadata:
            raise ValueError(f"Invalid column '{col}' in condition.")

        column_info = schema_metadata[col]
        datatype = column_info["datatype"]
        allowed_conditions = column_info["possible_condition_flags"]

        # Validate operator
        if op not in allowed_conditions:
            raise ValueError(f"Invalid condition '{op}' for column '{col}'. Allowed: {', '.join(allowed_conditions)}.")

        # Parse and validate value
        if op in {"IN", "BETWEEN"}:
            if not val.startswith("[") or not val.endswith("]"):
                raise ValueError(f"Invalid value format for operator '{op}'. Expected an array of values.")
            val_list = val[1:-1].split(",")
            val_list = [v.strip() for v in val_list]
            validate_value(val_list, datatype, op)
            if datatype == "INT":
                val_list = [int(v) for v in val_list]
            val = f"[{', '.join(map(repr, val_list))}]" if op == "IN" else f"{val_list[0]} AND {val_list[1]}"
        else:
            validate_value(val, datatype, op)

        # Translate to SQL
        sql_op = translate_operator(op)
        if op in {"IN", "BETWEEN"} and flag.strip() == "NOT":
            sql_op = "NOT " + sql_op 
        elif flag.strip() == "NOT":
            col = "NOT "+col

        clause = f"{col} {sql_op} {val}"
        
        # Append logical operator if present
        if i >= 0 and (logic.strip() == 'AND' or logic.strip() == 'OR') :
            clause = f"{clause} {logic}"
        elif i > 0 and logic != "":
            raise ValueError(f"Invalid {logic} use 'AND' or 'OR'.")

        where_clauses.append(clause)

    # Combine WHERE clauses
    where_clause = " ".join(where_clauses)

    # Build final query
    return f"SELECT {display_clause} FROM {table_name} WHERE {where_clause}"