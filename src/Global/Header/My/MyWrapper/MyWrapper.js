import My from '../My';

const MyWrapper = ({ myStyle }) => {
  return (
    <div className={myStyle}>
      <My credit="BIL" entity={230504501}>
        امتیاز
      </My>
      <My credit="T" entity={540023}>
        موجودی
      </My>
    </div>
  );
};

export default MyWrapper;
