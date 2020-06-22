import React from 'react';
import '../Style/JumbotronMain.css';
const JumbotronMain = (props) => {
    return (
        <div id="header" className="jumbotron text-center">
            <div id="Jumbo" className="None">
                <h1 className="display-3">Generic Tutoring Assistant System</h1>
                <hr />
                <p className="lead" >מערכת עזר מלמדת למורים ולתלמידים</p>
            </div>
        </div>
    );
}
export default JumbotronMain;