import React, { useState } from 'react';

const CreateMaterial = ({ match: { params } }) => {
    const [state, setState] = useState({ topic: '', subTopic: [] })
    const [stateError, setStateError] = useState({ topic: '' })
    const handleSubmit = (event) => {
        event.preventDefault()
        if (state) {
            setStateError({ topic: 'Must Enter Topic !' })
        }
        else {
            setStateError({ topic: '' })
            //need implement here to pass to the backend
        }

    }
    return (
        <form
            className="ui error form"
            onSubmit={handleSubmit}>
            <h1>Create Material</h1>
            <div>
                <label>Topic</label>

                <br />
                <input placeholder="Topic Name"
                    style={{ width: '50vw' }}
                    name="Topic"
                    type="text"
                    value={state.topic}
                    onChange={(event) => {
                        setState({ ...state, topic: event.target.value })
                    }}
                />
                <div className='ui error message header' style={{ width: '25vw', fontSize: '1em' }}>
                    {stateError.topic}
                </div>

            </div>
            <button>click</button>
        </form>
    )
}
export default CreateMaterial;