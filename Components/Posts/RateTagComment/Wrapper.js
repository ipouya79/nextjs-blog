import React from 'react'
import styles from './Wrapper.module.css'
import StarRating from './StarRating'
import LabelTag from './LabelTag'
function Wrapper({ items }) {
    return (
        <>
        <div className={styles.wrapperCon}>
<div><StarRating/></div>
<div><LabelTag items={items} /></div>

        </div>
            
        </>
    )
}

export default Wrapper
