/* eslint-disable react/prop-types */

const Navbar = ({ User }) => {
  return (
    <div className="h-14 w-full shadow-md flex justify-between items-center px-10">
      <p>Logo</p>
      <div className="h-10 w-10 rounded-full overflow-hidden object-contain">
        {User.picture?
        <img src={User.picture} alt=""/>
        :null}
      </div>
    </div>
  )
}

export default Navbar
