import ResetComp from "../components/Reset";

const Reset = props => {
  return <ResetComp resetToken={props.query.resetToken} />;
};
export default Reset;
