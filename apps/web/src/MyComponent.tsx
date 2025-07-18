const user: {[key: string]: string | number} = {
    name: "Hedy Lamarr",
    imageUrl: 'https://i.imgur.com/yXOvdOSs.jpg',
    imageSize: 100
}

function MyComponent() {
  return (
    <>
        <h1>{user.name}</h1>
        <img 
            className="avatar" 
            src={user.imageUrl as string} 
            alt="image"
            style={{
                width: user.imageSize,
                height: user.imageSize,
                borderRadius: 100
            }}
        />
    </>
  )
}

export default MyComponent;