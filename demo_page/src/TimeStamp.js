import React, { Component } from 'react';


class TimeStamp extends Component {


    render() {
        console.log(this.props.stamps)
        const stamps = this.props.stamps;
        const timeStampsList = stamps.map( (stamp) => {
            return (
                <li key={stamp.id}>{stamp.id}
                    <ul>
                        <li>{stamp.createdAt}</li>
                    </ul>
                </li>
            )
        })

        return (
            <div>
                {timeStampsList.length > 0 ?
                <ul>
                    {timeStampsList}
                </ul>
                :
                <p>Nothing to see here...</p>
                }
            </div>

        )
    }
}
export default TimeStamp;