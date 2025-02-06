  
import os
from flask_admin import Admin
from .models import db, User, Contact, SensitiveData, Group, Reserva, Empresa, UserPermission, QrCode
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='4Geeks Admin', template_mode='bootstrap3')

    class userAdmin(ModelView):
        column_display_pk = True
        list_display = ("id", "name", "text")
    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(userAdmin(User, db.session))
    admin.add_view(userAdmin(Contact, db.session))
    admin.add_view(userAdmin(SensitiveData, db.session))
    admin.add_view(userAdmin(Group, db.session))
    admin.add_view(userAdmin(Reserva, db.session))
    admin.add_view(userAdmin(Empresa, db.session))
    admin.add_view(userAdmin(UserPermission, db.session))
    admin.add_view(userAdmin(QrCode, db.session))
    
    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))