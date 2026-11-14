// const SlotItem = ({ slot, index }) => {

//   return (

//     <tr className="slot-table-row">

//       <td>
//         {index + 1}
//       </td>

//       <td className="slot-time">

//         {slot.startTime}
//         {" - "}
//         {slot.endTime}

//       </td>

//       <td>

//         <span
//           className={
//             slot.status === "Booked"
//               ? "slot-status booked"
//               : "slot-status available"
//           }
//         >

//           {slot.status}

//         </span>

//       </td>

//       <td>

//         <button
//           className="slot-action-btn"
//         >

//           View Details

//         </button>

//       </td>

//     </tr>

//   );

// };

// export default SlotItem;

// const SlotItem = ({
//   slot,
//   index,
//   onViewDetails
// }) => {

//   return (

//     <tr className="slot-table-row">

//       {/* Number */}

//       <td>
//         {index + 1}
//       </td>


//       {/* Time */}

//       <td className="slot-time">

//         {slot.startTime}

//         {" - "}

//         {slot.endTime}

//       </td>


//       {/* Status */}

//       <td>

//         <span
//           className={
//             slot.status === "Booked"
//               ? "slot-status booked"
//               : slot.status === "Available"
//               ? "slot-status available"
//               : "slot-status blocked"
//           }
//         >

//           {slot.status}

//         </span>

//       </td>


//       {/* Action */}

//       <td>

//         <button
//           type="button"
//           className="slot-action-btn"
//           onClick={() => onViewDetails(slot)}
//         >

//           View Details

//         </button>

//       </td>

//     </tr>

//   );

// };

// export default SlotItem;

const SlotItem = ({ slot, index, onViewDetails }) => {
  const status = slot.slotStatus ?? slot.status ?? "Unknown";

  return (
    <tr className="slot-table-row">
      <td>{index + 1}</td>

      <td className="slot-time">
        {slot.startTime} - {slot.endTime}
      </td>

      <td>
        <span
          className={
            status === "Booked"
              ? "slot-status booked"
              : status === "Available"
              ? "slot-status available"
              : "slot-status blocked"
          }
        >
          {status}
        </span>
      </td>

      <td>
        <button
          type="button"
          className="slot-action-btn"
          onClick={() => onViewDetails(slot)}
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

export default SlotItem;