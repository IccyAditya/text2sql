import re
from modules.multiColumns import parse_multiple_columns
from modules.aggregations import parse_aggregations
from modules.orderLimits import parse_order_and_limits

def main_parser(user_input):
    """
    Main parser to route user input to the appropriate parsing module.
    
    Args:
        user_input (str): The user input command in the custom query language.
    
    Returns:
        str: The corresponding SQL query.
    """
    # Check for `OrderBy` block
    if "SORT" in user_input:
        try:
            sql_query = parse_order_and_limits(user_input)
            return sql_query
        except ValueError as e:
            raise ValueError(f"Error in Order and Limits: {str(e)}")
    
    # Check for `GroupBy` block
    elif "data on" in user_input:
        try:
            sql_query = parse_aggregations(user_input)
            return sql_query
        except ValueError as e:
            raise ValueError(f"Error in Aggregations: {str(e)}")
    
    # Fallback to Multiple Columns if neither `OrderBy` nor `GroupBy` are present
    else:
        try:
            sql_query = parse_multiple_columns(user_input)
            return sql_query
        except ValueError as e:
            raise ValueError(f"Error in Multiple Columns: {str(e)}")
    
    # Raise error if input doesn't match any module
    raise ValueError("Invalid input format. No recognized command detected.")
