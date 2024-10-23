import { MouseEvent } from 'react';

function ListGroup(
    {items} : {items: {id: number, name: string}[]}
){

    const handleClick = (e: MouseEvent) => {
        alert(e.currentTarget.textContent);
    }

const getMessage = () => {
    if (items.length === 0) {
        return <h1>No items</h1>
    } else {
        return (
            <ul className="list-group">
                {items.map((item) => (
                    <li 
                    key={item.id} 
                    className="list-group-item list-group-item-action"
                    onClick={handleClick}
                    style={{cursor: "pointer"}}
                    >
                        {item.name}
                    </li>
                ))}
            </ul>
        )
    }
}
    return (
        <>
            <h1>List Group</h1>
            {getMessage()}
        </>
    )
}

export default ListGroup;