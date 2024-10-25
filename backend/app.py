from flask import Flask , jsonify
from flask_sqlalchemy import SQLAlchemy
from flask import request
from flask_restful import reqparse,abort,Resource,Api,fields,marshal_with
from flask_cors import cross_origin


app = Flask(__name__)

api = Api(app)

app.config['SQLALCHEMY_DATABASE_URI']='DB_URI_STRING'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class UserModel(db.Model):
	id = db.Column(db.Integer,primary_key=True)
	name = db.Column(db.String(100),nullable=False)
	email = db.Column(db.String(120),unique=True,nullable=False)

	def __repr__(self):
		return f"User(name ={self.name}, email ={self.email})"

# -----------------------------------------------
# -----------------------------------------------
@app.route('/')
def home():
	return '<h1>Flask REST API</h1>'

@app.route('/query', methods=['GET'])
@cross_origin()
def handle_query():
    query_param = request.args.get('param', default='default_value')
    response_data = {
        'message': 'Success',
        'query_param': query_param
    }
    return jsonify(response_data)

# -----------------------------------------------
# REST - API 
# -----------------------------------------------

# validator & parser : 
user_parser = reqparse.RequestParser()
user_parser.add_argument('name',required=True,type=str,help='Blank not allowed !')
user_parser.add_argument('email',required=True,type=str,help='Blank not allowed !')

# Serialize Format:
userFields = {
	'id':fields.Integer,
	'name':fields.String,
	'email':fields.String
}

# REST Resources : whose state is restified .
class Users(Resource):
	# GET METHOD :
	@marshal_with(userFields)
	def get(self):
		users = UserModel.query.all()
		return users

	# POST METHOD :
	@marshal_with(userFields)
	def post(self):
		args = user_parser.parse_args()
		new_user = UserModel(name=args['name'],email=args['email'])
		db.session.add(new_user)
		db.session.commit()
		users = UserModel.query.all()
		return users , 201

class User(Resource):
	# GET METHOD :
	@marshal_with(userFields)
	def get(self,id):
		user = UserModel.query.filter_by(id=id).first()
		if not user :
			abort(404,'Unkown user')
		return user
			
	# Update METHOD :
	@marshal_with(userFields)
	def patch(self,id):
		args = user_parser.parse_args()
		user = UserModel.query.filter_by(id=id).first()
		if not user :
			abort(404,'Unkown user')
		user.name = args['name']
		user.email = args['email']
		db.session.commit()
		return user , 201

	# Delete METHOD :
	@marshal_with(userFields)
	def delete(self,id):
		args = user_parser.parse_args()
		user = UserModel.query.filter_by(id=id).first()
		if not user :
			abort(404,'Unkown user')
		db.session.delete(user)
		db.session.commit()
		users = UserModel.query.all()
		return users , 204
		

# -----------------------------------------------
# -----------------------------------------------
api.add_resource(Users,'/api/users/')
api.add_resource(User,'/api/users/<int:id>')

if __name__ == '__main__':
	app.run(debug=True)
