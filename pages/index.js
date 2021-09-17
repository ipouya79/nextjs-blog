
import MainBlogPage from '../Components/MainBlogPage'
export default function Home(props) {
  const {events} = props
  return (
    <>
    <div>
       <MainBlogPage myevent={events}/>    
 
    </div>
  )
</>
  )
}
export async function getStaticProps() {
  const res = await fetch(`https://iranchemi.com/api/blogs/all`);
  const blogs = await res.json();
  return {
    props: { events: blogs },
    revalidate: 86400,
  };
}
