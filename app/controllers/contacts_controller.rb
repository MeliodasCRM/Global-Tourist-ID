class ContactsController < ApplicationController
  # ...existing code...

  def create
    @contact = Contact.new(contact_params)
    @contact.user = current_user
    
    # Verificar si es el primer contacto del usuario
    @contact.is_admin = current_user.contacts.empty?

    if @contact.save
      redirect_to contacts_path, notice: t('.success')
    else
      render :new, status: :unprocessable_entity
    end
  end

  # ...existing code...
end
