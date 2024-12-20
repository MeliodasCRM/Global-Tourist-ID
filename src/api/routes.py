"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from werkzeug.security import generate_password_hash, check_password_hash #(Libreria que sirve para guardar una constraseña segura)

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.get_json()
        print("Datos recibidos:", data)

        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        print("Datos procesados - Name:", name, "Email:", email)

        if not name or not email or not password:
            print("Datos incompletos")
            return jsonify({"message": "Todos los campos son requeridos"}), 400

        if User.query.filter_by(email=email).first():
            print("Usuario ya existe")
            return jsonify({"message": "El usuario ya existe"}), 400

        hashed_password = generate_password_hash(password)
        print("Contraseña hasheada correctamente")

        new_user = User(name=name, email=email, password=hashed_password, is_active=True)
        print("Intentando guardar el usuario en la base de datos...")

        db.session.add(new_user)
        db.session.commit()
        print("Usuario guardado exitosamente")

        return jsonify({"message": "Usuario registrado exitosamente"}), 201
    except Exception as e:
        print(f"Error en el endpoint /signup: {str(e)}")
        return jsonify({"message": "Error interno en el servidor", "error": str(e)}), 500

@api.route ('/login', methods=['POST'])
def handle_Login():
    # Verificar si los datos están presentes
    data = request.json
    if not data:
        return jsonify({"message": "Debe enviar datos en el cuerpo de la solicitud"}), 400

    # Obtener email y contraseña del cuerpo de la solicitud
    email = data.get('email')
    password = data.get('password')

    # Validar email y contraseña
    if not email or not password:
        return jsonify({"message": "El email y password son requeridos"}), 400

    # Buscar el usuario por email en la base de datos
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Usuario o contraseña incorrectos"}), 401

    # Crear un token de acceso utilizando el email del usuario
    token = create_access_token(identity=user.email)
    return(token)

@api.route('/user', methods=['GET'])
@api.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id=None):
    try:
        if user_id:
            # Obtener un usuario específico
            user = User.query.get(user_id)
            if not user:
                return jsonify({"message": "Usuario no encontrado"}), 404
            return jsonify(user.serialize()), 200
        else:
            # Obtener todos los usuarios
            users = User.query.all()
            return jsonify([user.serialize() for user in users]), 200
    except Exception as e:
        return jsonify({"message": "Error al obtener los usuarios", "error": str(e)}), 500
    
@api.route('/user', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"message": "El email y password son requeridos"}), 400

        # Verificar si el usuario ya existe
        if User.query.filter_by(email=email).first():
            return jsonify({"message": "El usuario ya existe"}), 400

        # Hashear la contraseña
        hashed_password = generate_password_hash(password)

        # Crear nuevo usuario
        new_user = User(name=name, email=email, password=hashed_password, is_active=True)
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "Usuario creado exitosamente", "user": new_user.serialize()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al crear el usuario", "error": str(e)}), 500


@api.route('/user/<int:user_id>', methods=['PUT'])
def modify_user(user_id):  # Nombre único para la función
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        data = request.get_json()
        user.name = data.get('name', user.name)
        user.email = data.get('email', user.email)
        user.is_active = data.get('is_active', user.is_active)

        db.session.commit()
        return jsonify({"message": "Usuario actualizado exitosamente", "user": user.serialize()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Error al actualizar el usuario", "error": str(e)}), 500
    

@api.route('/user/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    try:
        # Buscar el usuario en la base de datos por su ID
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({"message": "Usuario no encontrado"}), 404

        # Guardar el email del usuario antes de eliminarlo
        user_email = user.email

        # Eliminar el usuario de la base de datos
        db.session.delete(user)
        db.session.commit()

        # Devolver un mensaje con el email del usuario eliminado
        return jsonify({"message": f"Usuario con email '{user_email}' eliminado exitosamente"}), 200

    except Exception as e:
        # Manejar cualquier error inesperado
        db.session.rollback()
        return jsonify({"message": "Error al eliminar el usuario", "error": str(e)}), 500
