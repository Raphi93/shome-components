import "./Spinner.css";

export function Spinner() {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="item-spinner item-1" />
        <div className="item-spinner item-2" />
        <div className="item-spinner item-3" />
        <div className="item-spinner item-4" />
        <div className="circle-spinner" />      
      </div>
    </div>
  );
}
