import UpdateItem from "../components/UpdateItem";

// the id is contained in the query param created when clicking on an item and is only available on the page level
// could use withRouter - exposes the id
// but in _app.js we passed the query params (geProps.query = ctx.query;) so they're already available to us
const Sell = ({ query }) => (
  <div>
    <UpdateItem id={query.id} />
  </div>
);

export default Sell;
