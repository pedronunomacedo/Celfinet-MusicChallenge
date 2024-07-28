import React from 'react'
import { Button } from 'antd';

export const DefaultBtn = ({ onClick, title }) => {
    return (
        <Button
            onClick={() => onClick()}
        >
            {title}
        </Button>
    )
};