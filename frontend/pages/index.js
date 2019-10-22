// Next.js takes care of importing React
// https://github.com/zeit/next.js/#custom-app

import Items from "../components/Items";

const Home = props => {
  return (
    <div>
      <Items page={parseFloat(props.query.page) || 1} />
    </div>
  );
};
export default Home;
