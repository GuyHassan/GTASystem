import React from 'react';

const AboutUs = () => {
    return (
        <div>
            {/* style={{ color: 'blue', fontWeight: '700' }} */}
            <h1 className="titleComp" style={{ textDecoration: 'none' }}>About Us</h1>
            <hr style={{ borderColor: 'blue', width: '80vw' }} />
            <h5 style={{ fontSize: '20px' }}>
                Hello, we are Guy Hassan and Yinon Hiriri. <br />
                Software Engineering students at Sami Shimon College (SCE) fourth year. <br />
                After four intense years, we reached the final year of the degree and were asked to produce a final project as part of the degree assignments.</h5>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=guy.hasan@gmail.com" target="_blank" >
                Contact Us :
                <img src="https://img.icons8.com/cute-clipart/128/000000/google-logo.png" alt="imageDestroyd"/>
            </a>
        </div>
    )
}
export default AboutUs;