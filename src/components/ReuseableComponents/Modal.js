import React from 'react';
import ReactDOM from 'react-dom';
import '../Style/Modal.css';
const Modal = ({ title, children }) => {
    /* Portals provide a first-class way to render children into a DOM node that
        exists outside the DOM hierarchy of the parent component.
        ReactDOM.createPortal(child - is a jsx that we return, container - is a document from a index.html in public folder)
 */
    return ReactDOM.createPortal(
        /*onDismiss is a callback function 
          when the user click on any where in the popup windows the site return to the main root ("/")
          if we use with stopPropagation() in the child element we tell him
          only when you click on the the this specific div go out to the main ! */
        <div
            className="ui dimmer modals visible active" >
            {/*stopPropagation is dont listen to parent callback / any action he doing  */}
            <div
                id='content'
                onClick={(e) => e.stopPropagation()}
                className="ui standard modal visible active" style={{ height: '50vh' }}>
                <h1 className="header" style={{ fontSize: '30px', color: '#A52A2A', textDecoration: 'underLine' }}>{title}</h1>

                <div style={{ textAlign: 'center' }}>
                    {children}
                </div>
            </div>
        </div>,
        document.querySelector("#hintModal")
    );
};

export default Modal;