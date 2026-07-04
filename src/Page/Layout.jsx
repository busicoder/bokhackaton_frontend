import Footer from './Footer';
import './Layout.css';

function Layout({content}){
    return (
        <>
            <div id='entire'>
                <div id='main'>
                    {content}
                </div>
                <Footer />
            </div>
        </>
    );
}
export default Layout;