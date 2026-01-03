import React from 'react'

const AxesBottom = ({color = "#14171A"} : {color?:string}) => {
    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.2802 5.96655L8.93355 10.3132C8.42021 10.8266 7.58021 10.8266 7.06688 10.3132L2.72021 5.96655" stroke={color} strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

    )
}

export default AxesBottom