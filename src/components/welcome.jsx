import React from 'react';
const Welcome = ({ close }) => {
    return (
        <div className="modal" style={close ? { display: 'block' } : { display: 'none' }}>
            <div className="modal-dialog">
                <div className="modal-content">

                    <div className="modal-header">
                        <h4 className="modal-title">Few Things to know first!</h4>
                        <button type="button" className="close" onClick={close}>&times;</button>
                    </div>

                    <div className="modal-body">
                        <p>I have never used weather API before, I just read they need jQuery so I added, later on while doing development I realized that jQuery is only required for sending ajax requests. I use axios for calling APIs and Never used jQuery in my react projects, jQuery can be replaced with axios in this project.</p>
                        <p><i>I'm not getting <u>High &amp; Low</u> Temperature properties for current Day in API response, so placing alternate values for demonstration</i></p>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn btn-danger" onClick={close}>Close</button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Welcome;