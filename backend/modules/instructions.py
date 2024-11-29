import json

def get_meta_data(filepath):
    with open(filepath, 'r') as file:
        data = json.load(file)
    return data


def generate_sql_instructions(sentence):
    words = sentence.split()
    matched_columns = []
    special_instructions = [
        {
            "header": "General Instructions",
            "data": [
                {
                    "code": "Provide me data of loans whose condition1 AND/OR condition2 only include column1,column2.",
                    "explanation": "This retrieves loans based on specified conditions applied to specific columns."
                },
                {
                    "code": "SORT column1 in asc, column2 in desc LIMIT N|None.",
                    "explanation": "This sorts results by specified columns and limits the number of results."
                }
            ]
        }
    ]

    # Load column metadata
    columns = get_meta_data("meta.json")

    # Match columns from input sentence
    for word in words:
        if word in columns:
            matched_columns.append(word)

    if matched_columns:
        instructions = []

        # Process each matched column
        for column in matched_columns:
            column_data = {
                "header": f"To query on {column}",
                "data": []
            }
            conditions = columns[column]["possible_condition_flags"]

            data_type = columns[column]["datatype"]

            # Generate code examples for each condition
            for condition in conditions:
                if condition == "IN":
                    column_data["data"].append({
                        "code": f"Provide me data of loans whose {column} {condition} [v1,v2..]",
                        "explanation": f"This retrieves rows where {column} matches any value from the list."
                    })
                elif condition == "BETWEEN":
                    column_data["data"].append({
                        "code": f"Provide me data of loans whose {column} {condition} [start,end]",
                        "explanation": f"This retrieves rows where {column} falls within the specified range."
                    })
                else:
                    column_data["data"].append({
                        "code": f"Provide me data of loans whose {column} {condition} value",
                        "explanation": f"This retrieves rows where {column} matches the specified condition '{condition}'."
                    })
            
            if data_type in ["INT", "DECIMAL"]:
                column_data["data"].append({
                    "code": f"Provide me data on SUM|MAX|MIN|AVG of {column} for each OtherColumn in loans.",
                    "explanation": f"This provides the total, maximum, minimum, and average values of {column} grouped by OtherColumn."
                })
            elif data_type == "VARCHAR":
                column_data["data"].append({
                    "code": f"Provide me data on COUNT of {column} for each OtherColumn in loans.",
                    "explanation": f"This counts the number of occurrences of each unique value in {column} grouped by OtherColumn."
                })
            instructions.append(column_data)
        instructions.extend(special_instructions)

        return instructions
    else:
        return [{"header": "No matching columns found.", "data": [ {"code": f"To know the DataBase Schema click Info on top for columns list."}]}]

