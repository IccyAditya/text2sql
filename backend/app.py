from modules.parser import main_parser
from modules.instructions import generate_sql_instructions

from flask_cors import cross_origin
from flask import Flask, request, jsonify , Response

from flask_sqlalchemy import SQLAlchemy
import csv
import io
from sqlalchemy import text


app = Flask(__name__)

# Configure MySQL connection URI :
app.config['SQLALCHEMY_DATABASE_URI'] = 'DATA_BASE_URI'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


# MYSQL SERVER LOGGER :
app.config['SQLALCHEMY_ECHO'] = True

db = SQLAlchemy(app)



@app.route('/instruction', methods=['GET'])
@cross_origin()
def get_instructions():
    sentence = request.args.get('prompt', None)

    results = generate_sql_instructions(sentence)
    print(results)
    return jsonify({"instructions": results})

@app.route('/query', methods=['GET'])
@cross_origin()
def get_sql():
    try:
        sentence = request.args.get('prompt', None)
 
        results = main_parser(sentence)
        return jsonify({"query": results})

    except ValueError as e:
        return jsonify({"error": str(e)}), 500


@app.route('/execute', methods=['GET'])
@cross_origin()
def get_data_csv():
    try:
        query = request.args.get('prompt', None)
        result = db.session.execute(text(query)).fetchall()

        column_names = [column[0] for column in db.session.execute(text(query)).cursor.description]

        output = io.StringIO()
        csv_writer = csv.writer(output)
        
        csv_writer.writerow(column_names)
        
        for row in result:
            csv_writer.writerow(row)


        output.seek(0)
        return Response(output, mimetype='text/csv', headers={"Content-Disposition": "attachment;filename=data.csv"})
    
    except Exception as e:
        return jsonify({"error":e}) , 500


@app.route('/preview', methods=['GET'])
@cross_origin()
def get_data_display():
    try:
        query = request.args.get('prompt', None)
        result = db.session.execute(text(query)).fetchall()

        column_names = [column[0] for column in db.session.execute(text(query)).cursor.description]

        if not result:
            return jsonify({"error":"No results found"})

        rows = result[:10]
        limited_columns = column_names[:7]

        filtered_data = []
        for row in rows:
            filtered_row = {limited_columns[i]: row[i] for i in range(len(limited_columns))}
            filtered_data.append(filtered_row)

        return jsonify({"preview":filtered_data})

    except Exception as e:
        return jsonify({"error":e}), 500


if __name__ == '__main__':
    app.run(debug=True)
