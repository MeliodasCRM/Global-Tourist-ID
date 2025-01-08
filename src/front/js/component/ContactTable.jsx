import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { FaTrashCan, FaMarker } from "react-icons/fa6";
import "../../styles/contactTable.css";

const ContactTable = ({ contacts, borrarContacto, editarContacto }) => {
    //Obtengo la lista de contactos desde Store
    const { store } = useContext(Context);
    console.log("Contactos en el store:", store.contacts);

    // Verificación de existencia de contactos
    if (!store.contacts || store.contacts.length === 0) {
        return <p>No Hay Contactos Disponibles</p>;
    }

    return (
        <div className="container-xl">
            <div className="table-responsive">
                <div className="table-wrapper">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>
                                    <span className="custom-checkbox">
                                        <input type="checkbox" id="selectAll" />
                                        <label htmlFor="selectAll"></label>
                                    </span>
                                </th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact) => (
                                <tr key={contact.id}>
                                    <td>
                                        <span className="custom-checkbox">
                                            <input type="checkbox" id={`checkbox${contact.id}`} name="options[]" value="1" />
                                            <label htmlFor={`checkbox${contact.id}`}></label>
                                        </span>
                                    </td>
                                    <td className="contact-image-container"><img src={contact.imageUrl} alt={contact.name} className="contact-image" /></td>
                                    <td>{contact.name}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.address}</td>
                                    <td>{contact.phone}</td>
                                    <td>
                                        <div className="contact-actions">
                                            <FaMarker
                                                className="FaMarker-icon"
                                                onClick={() => editarContacto(contact)}
                                            />
                                            <FaTrashCan
                                                className="FaTrashCan-icon"
                                                onClick={() => borrarContacto(contact.id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="clearfix">
                        <div className="hint-text">Showing <b>{contacts.length}</b> out of <b>{contacts.length}</b> entries</div>
                        <ul className="pagination">
                            <li className="page-item disabled"><a href="#">Previous</a></li>
                            <li className="page-item"><a href="#" className="page-link">1</a></li>
                            <li className="page-item"><a href="#" className="page-link">2</a></li>
                            <li className="page-item active"><a href="#" className="page-link">3</a></li>
                            <li className="page-item"><a href="#" className="page-link">4</a></li>
                            <li className="page-item"><a href="#" className="page-link">5</a></li>
                            <li className="page-item"><a href="#" className="page-link">Next</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactTable;