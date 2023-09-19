import './style.css';

interface ITextGroup {
  label: string;
  content?: string | number | null;
  color?: string;
  dates?: string[];
}

export const TextGroup = ({ label, content, color, dates }: ITextGroup) => {
  return (
    <div className="textGroup">
      <label className="label">{label}</label>
      {!dates ? (
        <p className={color ? `content-${color}` : 'content'}>{content}</p>
      ) : (
        <div className="dates">
          {dates && dates.map((date) => <p className={'date'}>{date}</p>)}
        </div>
      )}
    </div>
  );
};
