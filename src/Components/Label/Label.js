const Label = ({ labelFor, lableContent, lableClass }) => {
  return (
    <label htmlFor={labelFor} className={lableClass}>
      {lableContent}
    </label>
  );
};

export default Label;
