type User = {
  id: number,
  name: string
}

export default async function Home() {
  let engineers: User[] = [{id:1, name: "John Doe"}, {id:2, name: "Jane Smith"}];
  // try{
  //   const res = await fetch('http://localhost:5003/api/backendEngineers', {cache: "no-cache"})
  //   const data = await res.json()
  //   engineers = data.users;
  // } catch (error){
  //   console.error(error)
  // }

  return (
    <div>
      <p>Backend by:</p>
      {engineers.map((user)=>{
        return <p key={user.id}>{user.name}</p>
      })}
    </div>
  )
}
