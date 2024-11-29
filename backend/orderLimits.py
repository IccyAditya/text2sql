import re
from modules.multiColumns import parse_multiple_columns
from modules.aggregations import parse_aggregations


def parse_order_and_limits(user_input):
    """
    Parse the Select, Order, and Limits command, handle multi-column ordering, and validate input,
    including support for specifying the table name and selected columns.
    
    Args:
        user_input (str): The user command in custom syntax.
        
    Returns:
        str: The corresponding MySQL query.
    """
    # Define the pattern for a query with aggregation or multi-column and order by with limit
    pattern = r"(.*?)\s*SORT\s+(.+?)\s+LIMIT\s+(\w+)$"
    
    # Match the user input against the pattern
    match = re.match(pattern, user_input)
    
    if not match:
        raise ValueError("Invalid format. Expected syntax:'Provide .... SORT column1 in asc, column2 in desc LIMIT N|None'")

    # Split the input into sub-query (aggregation or multi-column) and OrderBy section
    sub_query, order_by_section, limit = match.groups()

    # Validate the limit value
    if (not limit.isdigit() and limit != 'None') or (limit.isdigit() and int(limit) <= 0):
        raise ValueError("Invalid limit. The value after 'LIMIT' must be a positive integer | None - for all rows.")
    
    if limit.isdigit():
        limit = "LIMIT "+limit
    else:
        limit = ""

    # Process the sub-query (either an aggregation or multi-column query)
    if "data on" in sub_query:
        # Process aggregation (group by) logic
        aggregation_query = parse_aggregations(sub_query)
        
        # Ensure that columns used in OrderBy are either group by columns or aggregation functions
        order_columns = order_by_section.split(",")
        valid_columns = [col.strip().split("in")[0] for col in order_columns]

        # Make sure GroupBy columns or aggregation functions are being ordered
        if any(col not in aggregation_query for col in valid_columns):
            raise ValueError("In 'SORT', the column{col} not in results")
        
        # Now append OrderBy and Limit clauses to the aggregation query
        order_clauses = []
        for col in order_columns:
            col_name, order = map(str.strip, col.split("in"))
            if order.upper() not in {"ASC", "DESC"}:
                raise ValueError(f"Invalid ordering direction '{order}'. Allowed values are 'ASC' or 'DESC'.")
            order_clauses.append(f"{col_name} {order.upper()}")
        
        order_by_clause = "ORDER BY " + ", ".join(order_clauses)
        final_query = f"{aggregation_query} {order_by_clause} {(limit,' ')[limit.isdigit()]}"
    
    else:
        # Process multi-column conditions
        multi_column_query = parse_multiple_columns(sub_query)
        
        # Append OrderBy and Limit clauses to the multi-column query
        order_clauses = []
        for col in order_by_section.split(","):
            col_name, order = map(str.strip, col.split("in"))
            if order.upper() not in {"ASC", "DESC"}:
                raise ValueError(f"Invalid ordering direction '{order}'. Allowed values are 'ASC' or 'DESC'.")
            order_clauses.append(f"{col_name} {order.upper()}")
        
        order_by_clause = "ORDER BY " + ", ".join(order_clauses)
        final_query = f"{multi_column_query} {order_by_clause} {limit}"

    return final_query
