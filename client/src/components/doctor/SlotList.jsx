// import SlotItem from "./SlotItem";

// const SlotList = ({ slots }) => {

//   if (slots.length === 0) {

//     return (
//       <div className="empty-card">
//         No Slots Found
//       </div>
//     );

//   }

//   return (

//     <div className="slot-table-wrapper">

//       <table className="slot-table">

//         <thead>

//           <tr>

//             <th>#</th>

//             <th>Time</th>

//             <th>Status</th>

//             <th>Action</th>

//           </tr>

//         </thead>

//         <tbody>

//           {slots.map((slot, index) => (

//             <SlotItem
//               key={slot._id}
//               slot={slot}
//               index={index}
//             />

//           ))}

//         </tbody>

//       </table>

//     </div>

//   );

// };

// export default SlotList;


import SlotItem from "./SlotItem";

const SlotList = ({
  slots,
  onViewDetails
}) => {

  if (slots.length === 0) {

    return (
      <div className="empty-card">
        No Slots Found
      </div>
    );

  }

  return (

    <div className="slot-table-wrapper">

      <table className="slot-table">

        <thead>

          <tr>

            <th>#</th>

            <th>Time</th>

            <th>Status</th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {slots.map((slot, index) => (

            <SlotItem
              key={slot._id}
              slot={slot}
              index={index}
              onViewDetails={onViewDetails}
            />

          ))}

        </tbody>

      </table>

    </div>

  );

};

export default SlotList;