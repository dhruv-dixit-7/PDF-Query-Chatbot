# app.py

from flask import Flask, request,jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

from bot import chatbot

from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client
from config import Config


app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)


# app = Flask(__name__)
CORS(app, resources = {r"/web": {"origins": "http://127.0.0.1:5500"}})
account_sid = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx'
auth_token = 'xxxxxxxxxxxxxxxxxxxxxxxxxx'
twilio_client = Client(account_sid, auth_token)
# Phone numbers you want to handle messages from
allowed_phone_numbers = ['+1xxxxxxxxxx']

# Models
class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    colonies = db.relationship('Colony', backref='city', lazy=True)

class Colony(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True, nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'), nullable=False)
    sizes = db.relationship('Size', backref='colony', lazy=True)

class Size(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    size = db.Column(db.String(64), nullable=False)
    colony_id = db.Column(db.Integer, db.ForeignKey('colony.id'), nullable=False)
    helps = db.relationship('Help', backref='size', lazy=True) 


class Help(db.Model):
    id =  db.Column(db.Integer, primary_key=True)
    help = db.Column(db.String(64), unique=False, nullable=False)
    size_id = db.Column(db.Integer, db.ForeignKey('size.id'), nullable=False)
    solutions = db.relationship('Solution', backref='help', lazy=True)

class Solution(db.Model):
    id =  db.Column(db.Integer, primary_key=True)
    solution = db.Column(db.String(64), unique=False, nullable=False)
    help_id = db.Column(db.Integer, db.ForeignKey('help.id'), nullable=False)    

#----------------------------------------
with app.app_context():
    db.create_all()
#-----------------------------------------

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cities')
def properties():
    cities = City.query.all()
    return jsonify([city.name for city in cities])

@app.route('/colonies/<int:city_id>', methods = ['POST'])
def colonies(city_id):
    colonies = Colony.query.filter_by(city_id = city_id).all()
    return jsonify([colony.name for colony in colonies])

@app.route('/sizes/<int:colony_id>', methods = ['POST'])
def sizes(colony_id):
    sizes = Size.query.filter_by(colony_id = colony_id).all()
    return jsonify([size.size for size in sizes])

@app.route('/helps/<int:size_id>', methods = ['POST'])
def helps(size_id):
    helps = Help.query.filter_by(size_id = size_id).all()
    return jsonify([help.help for help in helps])

@app.route('/fetch_solution_by_help/<int:help_id>', methods = ['POST'])
def fetch_solution_by_help(help_id):
    # help_id = request.json.get('help_id')
    solutions = Solution.query.filter_by(help_id=help_id).all()
    # solutions_list = [{'id': solution.id, 'solution': solution.solution} for solution in solutions]
    # return jsonify({'solutions': solutions_list})
    return jsonify([solution.solution for solution in solutions])

# @app.route('/query', methods=['POST'])
# def query():
#     data = request.json
#     question = data.get('question')
#     bot = Bot()
#     answer = bot.answer_question(question)
#     return jsonify({'answer': answer})
#--------------------------------------------------------------------

@app.route("/homepage", methods=['GET'])
def homepage():
    print("inside API")
    return render_template("index.html")

@app.route("/web", methods=['POST'])
def bot_web():
    print("inside api broda")
    if request.is_json:
        user_input = request.get_json()
        chatbot_input_text = user_input['question']
        response = chatbot(chatbot_input_text)
        return jsonify({"response": response})
    else:
        return "Sorry not a JSON input"
    
@app.route("/wp", methods=['POST'])
def wp_reply():
    msg = request.form.get('Body')
    response = chatbot(msg)
    resp = MessagingResponse()
    resp.message(response)
    return str(resp)

@app.route("/sms", methods=['POST'])
def sms_reply():
    sender_number = request.form['From']
    message_body = request.form['Body']
    # Function to process the message and send SMS response
    def process_and_send_sms(sender_number, message_body):
        if sender_number in allowed_phone_numbers:
                # Process the message (implement your specific message processing logic here)
                response_message = chatbot(message_body)
                print(response_message)
            # Send SMS response
                twilio_client.messages.create(
                body=response_message,
                from_='+19282125157',
                to=sender_number
            )
                return response_message
        else:
            return 'Unauthorized', 403
    return process_and_send_sms(sender_number, message_body)

if __name__ == '__main__':
    app.run(debug =True)























# # app.py

# from flask import Flask, render_template, request, jsonify
# from flask_sqlalchemy import SQLAlchemy
# from config import Config
# from bot import Bot

# app = Flask(__name__)
# app.config.from_object(Config)
# db = SQLAlchemy(app)

# class City(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(64), unique=True, nullable=False)
#     colonies = db.relationship('Colony', backref='city', lazy=True)

# class Colony(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(64), unique=True, nullable=False)
#     city_id = db.Column(db.Integer, db.ForeignKey('city.id'), nullable=False)
#     sizes = db.relationship('Size', backref='colony', lazy=True)

# class Size(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     size = db.Column(db.String(64), nullable=False)
#     colony_id = db.Column(db.Integer, db.ForeignKey('colony.id'), nullable=False)

# @app.route('/')
# def index():
#     return render_template('index.html')

# @app.route('/properties')
# def properties():
#     cities = City.query.all()
#     return render_template('properties.html', cities=cities)

# @app.route('/colonies/<int:city_id>')
# def colonies(city_id):
#     colonies = Colony.query.filter_by(city_id=city_id).all()
#     return jsonify([colony.name for colony in colonies])

# @app.route('/sizes/<int:colony_id>')
# def sizes(colony_id):
#     sizes = Size.query.filter_by(colony_id=colony_id).all()
#     return jsonify([size.size for size in sizes])

# @app.route('/query', methods=['POST'])
# def query():
#     data = request.json
#     question = data.get('question')
#     bot = Bot()
#     answer = bot.answer_question(question)
#     return jsonify({'answer': answer})

# if __name__ == '__main__':
#     app.run(debug=True)
