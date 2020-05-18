import React from 'react';

const CreateMaterialPractice = () => {
    return (
        <div>
            <h1 style={{ textDecoration: 'underline', marginBottom: '20px' }}>Page 1</h1>
            <form className="ui error form">
                <label >Question</label>
                <textarea name="freeText" /* onChange={} value={} */ placeholder="Write a Question?" cols="100" rows="3" />
                <br />
                <label >Answer 1</label>
                <input type="text" />
                <label >Answer 2</label>
                <input type="text" />
                <label >Answer 3</label>
                <input type="text" />
                <label >Answer 4</label>
                <input type="text" />
                <br /><br />
            </form>
        </div>
    )
}
export default CreateMaterialPractice;