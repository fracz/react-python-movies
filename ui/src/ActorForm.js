import {useState} from "react";

// export default function ActorForm(props) {

//   const [actorFields, setActorFields] = useState( { name: '', surname: '' })
//   // const [actors, setActors] = useState([]);
//   const handleAddActor = () => {
//     const actor = { ...actorFields };
//     console.log('actor', actor);
//     setActors([...actors, actor]);
//     setActorFields({ name: '', surname: '' });
//     console.log('actorOut', actors);
//   };

//   const handleRemoveActor = (index) => {
//     let actor = [...actors ];
//     actor.splice(index, 1);
//     setActors(actor);
//   };


//     return  <div ><h3>Actors:</h3>
//       <div >
//         <ul>
//           {actors.map((actor, index) => (
//             <li key={index}>
//               {actor.name} {actor.surname}
//               <button type="button" onClick={() => handleRemoveActor(index)}>Remove</button>
//             </li>
//         ))}
//         </ul>
//         <label>
//           Add Actor:
//           <input type="text" placeholder="name" value={actorFields.name} onChange={(event) => setActorFields({ ...actorFields, name: event.target.value })} />
//           <input type="text" placeholder="surname" value={actorFields.surname} onChange={(event) => setActorFields({ ...actorFields, surname: event.target.value })} />
//           <button type="button" onClick={handleAddActor}> Add </button>
//         </label>
//       </div>
//     </div>;
// }