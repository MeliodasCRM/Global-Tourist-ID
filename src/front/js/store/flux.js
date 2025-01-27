const { Col } = require("react-bootstrap");

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			authToken: localStorage.getItem("authToken") || null, // Inicializamos con el token del localStorage
			role: null, //inicilizo el rol del usuario
			user: null, // inicializo el usuario
			contact: [], // inicialdatos de contactos
			sensitive_data: [], //inicializo los datos sensibles
			group: [], // Incializo el array de grupos

		},
		actions: {
			// Use getActions to call a function within a fuction
			login: async (email, password) => {
				try {
				  const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				  });
			  
				  if (resp.ok) {
					const token = await resp.text();
					localStorage.setItem("authToken", token);
					setStore({ authToken: token });
			  
					// Llamamos a la nueva acción para cargar los datos del usuario después de hacer login
					await getActions().loadUser();
			  
					return { success: true, message: "Login exitoso" };
				  } else {
					const error = await resp.json();
					return { success: false, message: error.message || "Error en el login" };
				  }
				} catch (err) {
				  console.error("Error en login:", err);
				  return { success: false, message: "Error de conexión" };
				}
			  },
			  
			  // Acción para cargar el usuario en el store
			  loadUser: async () => {
				const store = getStore();
				console.log("Token JWT:", store.authToken);  // Verifica que el token esté disponible
				try {
				  const response = await fetch(`${process.env.BACKEND_URL}/api/user`, {
					method: "GET",
					headers: {
					  "Content-Type": "application/json",
					  "Authorization": `Bearer ${store.authToken}`,  // Verifica si el token está siendo enviado correctamente
					},
				  });
			  
				  if (response.ok) {
					const user = await response.json();
					console.log("Usuario cargado:", user);
					setStore({ user: user });  // Guardamos los datos del usuario en el store
				  } else {
					console.error("Error al cargar el usuario");
					const errorResponse = await response.json();
					console.log("Error al cargar usuario:", errorResponse);  // Verifica el error
				  }
				} catch (error) {
				  console.error("Error al cargar el usuario:", error);
				}
			  },

			logout: () => {
				localStorage.removeItem("authToken");  // Eliminamos el token del localStorage
				setStore({ authToken: null });  // Actualizamos el store para eliminar el token
				console.log("Usuario deslogueado exitosamente.");
			},

			signup: async (email, password, language) => {
				try {
					const resp = await fetch(process.env.BACKEND_URL + "/api/signup", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email, password, language }),  // Verifica que 'language' está siendo enviado correctamente
					});

					if (resp.ok) {
						const data = await resp.json();
						return { success: true, message: "Registro exitoso" };
					} else {
						const error = await resp.json();
						console.error("Error en el registro:", error);  // Agrega un log para ver el error detallado
						return { success: false, message: error.message || "Error en el registro" };
					}
				} catch (err) {
					console.error("Error en signup:", err);
					return { success: false, message: "Error de conexión" };
				}
			},

			// Acción para cargar los contactos
			loadContacts: async () => {
				const store = getStore();
				console.log("Token JWT:", store.authToken);  // Verifica que el token esté disponible
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/contact`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,  // Verifica si el token está siendo enviado correctamente
						},
					});

					if (response.ok) {
						const contacts = await response.json();
						console.log("Contactos cargados:", contacts);  // Verifica si los contactos están llegando
						setStore({ contact: contacts });  // Actualiza el store con los contactos
					} else {
						console.error("Error al cargar los contactos");
						const errorResponse = await response.json();
						console.log("Error al cargar contactos:", errorResponse);  // Verifica el error
					}
				} catch (error) {
					console.error("Error al cargar los contactos:", error);
				}
			},

			// Acción para cargar un solo contacto por ID
			loadSingleContact: async (contactId) => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/contact/${contactId}`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
					});

					if (response.ok) {
						const contact = await response.json();
						setStore({ singleContact: contact });  // Actualizamos el store con el contacto específico
						console.log("Contacto cargado correctamente:", contact);
					} else {
						console.error("Error al cargar el contacto");
					}
				} catch (error) {
					console.error("Error al cargar el contacto:", error);
				}
			},

			// Acción para actualizar un contacto
			updateContact: async (contactId, formData) => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/contact/${contactId}`, {
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
						body: JSON.stringify(formData),
					});

					if (response.ok) {
						const updatedContact = await response.json();
						// Actualizar la lista de contactos en el store
						const updatedContacts = store.contact.map(contact =>
							contact.id === contactId ? updatedContact : contact
						);
						setStore({ contact: updatedContacts });
						console.log("Contacto actualizado correctamente:", updatedContact);
					} else {
						console.error("Error al actualizar contacto");
					}
				} catch (err) {
					console.error("Error al actualizar contacto:", err);
				}
			},

			// Acción para eliminar un contacto
			deleteContact: async (contactId) => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/contact/${contactId}`, {
						method: "DELETE",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
					});

					if (response.ok) {
						const deletedContact = await response.json();
						// Eliminar el contacto del store
						const remainingContacts = store.contact.filter(contact => contact.id !== contactId);
						setStore({ contact: remainingContacts });
						console.log("Contacto eliminado correctamente:", deletedContact);
					} else {
						console.error("Error al eliminar contacto");
					}
				} catch (err) {
					console.error("Error al eliminar contacto:", err);
				}
			},

			// Acción para crear un contacto normal (no admin) y gestionar el grupo
			createNewContact: async (formData) => {
				const store = getStore();
				try {
					// Verificar si el usuario ya tiene contactos
					const userContacts = store.contact.filter(contact => contact.user_id === store.user.id);
					let contact;

					if (userContacts.length === 0) {
						// Si no existen contactos, crear el primero como admin
						const response = await fetch(`${process.env.BACKEND_URL}/api/contact`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Authorization": `Bearer ${store.authToken}`,
							},
							body: JSON.stringify({
								...formData,
								is_admin: true,  // Crear el primer contacto como admin
								user_id: store.user.id,
							}),
						});
						if (response.ok) {
							contact = await response.json();
							setStore({ contact: [contact] });
							// Crear el grupo asociado al contacto admin
							await getActions().createGroup(contact.id);
						}
					} else {
						// Si ya existe un contacto, crear uno normal y asociarlo al grupo
						contact = userContacts[0]; // Usamos el primer contacto encontrado

						const response = await fetch(`${process.env.BACKEND_URL}/api/contact`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								"Authorization": `Bearer ${store.authToken}`,
							},
							body: JSON.stringify({
								...formData,
								is_admin: false,  // No es admin
								user_id: store.user.id,
							}),
						});
						if (response.ok) {
							const newContact = await response.json();
							setStore({ contact: [...store.contact, newContact] });
							// Asociar el nuevo contacto al grupo principal
							await getActions().addToGroup(newContact.id, contact.id);  // Agregamos al grupo
						}
					}
				} catch (err) {
					console.error("Error al crear contacto o grupo:", err);
				}
			},

			// Acción para crear un nuevo grupo
			createGroup: async (contactId) => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/group`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
						body: JSON.stringify({
							contact_id: contactId,
							name: "Grupo de Contacto",  // Este es un nombre por defecto, puedes personalizarlo
						}),
					});
					if (response.ok) {
						const group = await response.json();
						setStore({ groups: [...store.groups, group] });
					}
				} catch (err) {
					console.error("Error al crear grupo:", err);
				}
			},

			// Acción para agregar un contacto al grupo
			addToGroup: async (contactId, groupId) => {
				const store = getStore();
				try {
					const response = await fetch(`${process.env.BACKEND_URL}/api/group/${groupId}/contact/${contactId}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							"Authorization": `Bearer ${store.authToken}`,
						},
					});
					if (response.ok) {
						const group = store.groups.find((g) => g.id === groupId);
						group.contacts.push(contactId); // Agrega el nuevo contacto al grupo
						setStore({ groups: [...store.groups] });
					}
				} catch (err) {
					console.error("Error al agregar contacto al grupo:", err);
				}
			},

			// Acción para cargar datos sensibles en el store
			loadSensitiveData: async () => {
				const store = getStore();
				try {
				  const response = await fetch(`${process.env.BACKEND_URL}/api/sensitive-data`, {
					method: "GET",
					headers: {
					  "Content-Type": "application/json",
					  "Authorization": `Bearer ${store.authToken}`,
					},
				  });
			  
				  if (response.ok) {
					const sensitiveData = await response.json();
					console.log("Datos sensibles cargados:", sensitiveData);  // Verifica si los datos sensibles están llegando
					setStore({ sensitive_data: sensitiveData });  // Actualiza el store con los datos sensibles
				  } else {
					console.error("Error al cargar los datos sensibles");
				  }
				} catch (error) {
				  console.error("Error al cargar los datos sensibles:", error);
				}
			  },


		},
	};
};

export default getState;
