"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, Blueprint
from api.models import db, User, DatosViajero, Transaccion, QRDatabase
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

        email = data.get('email')
        password = data.get('password')
        print("Datos procesados - Name:", "Email:", email)

        if not email or not password:
            print("Datos incompletos")
            return jsonify({"message": "Todos los campos son requeridos"}), 400

        if User.query.filter_by(email=email).first():
            print("Usuario ya existe")
            return jsonify({"message": "El usuario ya existe"}), 400

        hashed_password = generate_password_hash(password)
        print("Contraseña hasheada correctamente")

        new_user = User(email=email, password=hashed_password, is_active=True)
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

@api.route('/backoffice')
@jwt_required()  # Asegura que el usuario esté autenticado
def backoffice():
    return jsonify({"message": "Acceso al Backoffice permitido."})


# # OBTENER TODAS LAS EMPRESAS O UNA EN CONCRETO
# @api.route('/empresa', methods=['GET'])
# @api.route('/empresa/<int:empresa_id>', methods=['GET'])
# def get_empresa(empresa_id=None):
#     try:
#         if empresa_id:
#             # Obtener una empresa específica
#             empresa = Empresa.query.get(empresa_id)
#             if not empresa:
#                 return jsonify({"message": "Empresa no encontrado"}), 404
#             return jsonify(empresa.serialize()), 200
#         else:
#             # Obtener todos los usuarios
#             empresas = Empresa.query.all()
#             return jsonify([empresa.serialize() for empresa in empresas]), 200
#     except Exception as e:
#         return jsonify({"message": "Error al obtener las empresas", "error": str(e)}), 500
    
# # Crear una nueva empresa
# @api.route('/empresa', methods=['POST'])
# def create_empresa():
#     try:
#         data = request.get_json()
#         razon_social = data.get('razon_social')
#         cif = data.get('cif')
#         nombre_comercial = data.get('nombre_comercial')
#         domicilio = data.get('domicilio')
#         user_id = data.get('user_id')

#         if not razon_social or not cif or not nombre_comercial or not domicilio or not user_id:
#             return jsonify({"message": "Es necesario rellenar todos los campos"}), 400
        
#         new_empresa = Empresa(
#             razon_social = razon_social,
#             cif = cif,
#             nombre_comercial = nombre_comercial,
#             domicilio = domicilio,
#             user_id = user_id
#         )
#         db.session.add(new_empresa)
#         db.session.commit()

#         return jsonify({"message": "Empresa creada con éxito", "empresa": new_empresa.serialize()}), 201
#     except Exception as e:
#         return jsonify({"message": "Error al crear la empresa", "error": str(e)}), 500
    
# # ACTUALIZAR DATOS DE UNA EMPRESA
# @api.route('/empresa/<int:id>', methods=['PUT'])
# def update_empresa(id):
#     try:
#         data = request.get_json()
#         empresa = Empresa.query.get(id)

#         if not empresa:
#             return jsonify({"message": "Empresa no encontrada"}), 404

#         razon_social = data.get('razon_social')
#         cif = data.get('cif')
#         nombre_comercial = data.get('nombre_comercial')
#         domicilio = data.get('domicilio')
#         user_id = data.get('user_id')

#         if not razon_social or not cif or not nombre_comercial or not domicilio or not user_id:
#             return jsonify({"message": "Es necesario rellenar todos los campos"}), 400

#         empresa.razon_social = razon_social
#         empresa.cif = cif
#         empresa.nombre_comercial = nombre_comercial
#         empresa.domicilio = domicilio
#         empresa.user_id = user_id

#         db.session.commit()

#         return jsonify({"message": "Empresa actualizada con éxito", "empresa": empresa.serialize()}), 200
#     except Exception as e:
#         return jsonify({"message": "Error al actualizar la empresa", "error": str(e)}), 500
    
# # ELIMINAR UNA EMPRESA
# @api.route('/empresa/<int:id>', methods=['DELETE'])
# def delete_empresa(id):
#     try:
#         empresa = Empresa.query.get(id)

#         if not empresa:
#             return jsonify({"message": "Empresa no encontrada"}), 404

#         db.session.delete(empresa)
#         db.session.commit()

#         return jsonify({"message": "Empresa eliminada con éxito"}), 200
#     except Exception as e:
#         return jsonify({"message": "Error al eliminar la empresa", "error": str(e)}), 500

# # ALOJAMIENTOS

# # Crear un alojamiento
# @api.route('/alojamiento', methods=['POST'])
# def create_alojamiento():
#     try:
#         data = request.get_json()
#         nombre = data.get('nombre')
#         direccion = data.get('direccion')
#         empresa_id = data.get('empresa_id')

#         if not nombre or not direccion or not empresa_id:
#             return jsonify({"message": "Es necesario rellenar todos los campos"}), 400

#         new_alojamiento = Alojamiento(
#             nombre=nombre,
#             direccion=direccion,
#             empresa_id=empresa_id
#         )
#         db.session.add(new_alojamiento)
#         db.session.commit()

#         return jsonify({"message": "Alojamiento creado con éxito", "alojamiento": new_alojamiento.serialize()}), 201
#     except Exception as e:
#         return jsonify({"message": "Error al crear el alojamiento", "error": str(e)}), 500

# # Obtener todos los alojamientos
# @api.route('/alojamiento', methods=['GET'])
# def get_alojamientos():
#     try:
#         alojamientos = Alojamiento.query.all()
#         return jsonify([alojamiento.serialize() for alojamiento in alojamientos]), 200
#     except Exception as e:
#         return jsonify({"message": "Error al obtener los alojamientos", "error": str(e)}), 500

# # Obtener un alojamiento específico
# @api.route('/alojamiento/<int:alojamiento_id>', methods=['GET'])
# def get_alojamiento(alojamiento_id):
#     try:
#         alojamiento = Alojamiento.query.get(alojamiento_id)
#         if not alojamiento:
#             return jsonify({"message": "Alojamiento no encontrado"}), 404
#         return jsonify(alojamiento.serialize()), 200
#     except Exception as e:
#         return jsonify({"message": "Error al obtener el alojamiento", "error": str(e)}), 500

# # Actualizar un alojamiento
# @api.route('/alojamiento/<int:alojamiento_id>', methods=['PUT'])
# def update_alojamiento(alojamiento_id):
#     try:
#         data = request.get_json()
#         alojamiento = Alojamiento.query.get(alojamiento_id)

#         if not alojamiento:
#             return jsonify({"message": "Alojamiento no encontrado"}), 404

#         nombre = data.get('nombre')
#         direccion = data.get('direccion')
#         empresa_id = data.get('empresa_id')

#         if not nombre or not direccion or not empresa_id:
#             return jsonify({"message": "Es necesario rellenar todos los campos"}), 400

#         alojamiento.nombre = nombre
#         alojamiento.direccion = direccion
#         alojamiento.empresa_id = empresa_id

#         db.session.commit()

#         return jsonify({"message": "Alojamiento actualizado con éxito", "alojamiento": alojamiento.serialize()}), 200
#     except Exception as e:
#         return jsonify({"message": "Error al actualizar el alojamiento", "error": str(e)}), 500

# # Eliminar un alojamiento
# @api.route('/alojamiento/<int:alojamiento_id>', methods=['DELETE'])
# def delete_alojamiento(alojamiento_id):
#     try:
#         alojamiento = Alojamiento.query.get(alojamiento_id)

#         if not alojamiento:
#             return jsonify({"message": "Alojamiento no encontrado"}), 404

#         db.session.delete(alojamiento)
#         db.session.commit()

#         return jsonify({"message": "Alojamiento eliminado con éxito"}), 200
#     except Exception as e:
#         return jsonify({"message": "Error al eliminar el alojamiento", "error": str(e)}), 500

# # RESERVAS

# # Crear una reserva
# @api.route('/reserva', methods=['POST'])
# def create_reserva():
#     try:
#         data = request.get_json()
#         fecha_inicio = data.get('fecha_inicio')
#         fecha_fin = data.get('fecha_fin')
#         alojamiento_id = data.get('alojamiento_id')
#         user_id = data.get('user_id')

#         if not fecha_inicio or not fecha_fin or not alojamiento_id or not user_id:
#             return jsonify({"message": "Es necesario rellenar todos los campos"}), 400

#         new_reserva = Reserva(
#             fecha_inicio=fecha_inicio,
#             fecha_fin=fecha_fin,
#             alojamiento_id=alojamiento_id,
#             user_id=user_id
#         )
#         db.session.add(new_reserva)
#         db.session.commit()

#         return jsonify({"message": "Reserva creada con éxito", "reserva": new_reserva.serialize()}), 201
#     except Exception as e:
#         return jsonify({"message": "Error al crear la reserva", "error": str(e)}), 500

# # Obtener todas las reservas
# @api.route('/reserva', methods=['GET'])
# def get_reservas():
#     try:
#         reservas = Reserva.query.all()
#         return jsonify([reserva.serialize() for reserva in reservas]), 200
#     except Exception as e:
#         return jsonify({"message": "Error al obtener las reservas", "error": str(e)}), 500

# # Obtener una reserva específica
# @api.route('/reserva/<int:reserva_id>', methods=['GET'])
# def get_reserva(reserva_id):
#     try:
#         reserva = Reserva.query.get(reserva_id)
#         if not reserva:
#             return jsonify({"message": "Reserva no encontrada"}), 404
#         return jsonify(reserva.serialize()), 200
#     except Exception as e:
#         return jsonify({"message": "Error al obtener la reserva", "error": str(e)}), 500

# # Actualizar una reserva
# @api.route('/reserva/<int:reserva_id>', methods=['PUT'])
# def update_reserva(reserva_id):
#     try:
#         data = request.get_json()
#         reserva = Reserva.query.get(reserva_id)

#         if not reserva:
#             return jsonify({"message": "Reserva no encontrada"}), 404

#         fecha_inicio = data.get('fecha_inicio')
#         fecha_fin = data.get('fecha_fin')
#         alojamiento_id = data.get('alojamiento_id')
#         user_id = data.get('user_id')

#         if not fecha_inicio or not fecha_fin or not alojamiento_id or not user_id:
#             return jsonify({"message": "Es necesario rellenar todos los campos"}), 400

#         reserva.fecha_inicio = fecha_inicio
#         reserva.fecha_fin = fecha_fin
#         reserva.alojamiento_id = alojamiento_id
#         reserva.user_id = user_id

#         db.session.commit()

#         return jsonify({"message": "Reserva actualizada con éxito", "reserva": reserva.serialize()}), 200
#     except Exception as e:
#         return jsonify({"message": "Error al actualizar la reserva", "error": str(e)}), 500

# Eliminar una reserva
# @api.route('/reserva/<int:reserva_id>', methods=['DELETE'])
# def delete_reserva(reserva_id):
#     try:
#         reserva = Reservas.query.get(reserva_id)

#         if not reserva:
#             return jsonify({"message": "Reserva no encontrada"}), 404

#         db.session.delete(reserva)
#         db.session.commit()

#         return jsonify({"message": "Reserva eliminada con éxito"}), 200
#     except Exception as e:
#         return jsonify({"message": "Error al eliminar la reserva", "error": str(e)}), 500
