


const Footer: React.FC = () => {
    return(
        <footer className="grid grid-cols-1 flex flex-col xl:w-128" aria-labelledby="footer-heading">
        <h2 id="footer-heading" className="sr-only">Footer</h2>

        <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-16">
            <div className="xl:grid xl:grid-cols-2 xl:gap-8">
            
            <div className="grid grid-cols-2 gap-8 mt-12 xl:mt-0 xl:col-span-2">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                    <h3 className="text-sm font-bold tracking-wider text-teal-600 uppercase">Trades</h3>
                    <ul role="list" className="mt-4 space-y-2">
                    <li>
                        <a href="./pricing.html" className="text-base font-normal text-gray-500 hover:text-blue-600">Dashboard</a>
                    </li>
                    <li>
                        <a href="./templates.html" className="text-base font-normal text-gray-500 hover:text-blue-600">Properties</a>
                    </li>
                    <li>
                        <a href="./landing-pages.html" className="text-base font-normal text-gray-500 hover:text-blue-600">Jobs</a>
                    </li>
                    <li>
                        <a href="./nextjs.html" className="text-base font-normal text-gray-500 hover:text-blue-600">Demo</a>
                    </li>
                    <li>
                        <a href="./multi-page.html" className="text-base font-normal text-gray-500 hover:text-blue-600">Pricing</a>
                    </li>
                    </ul>
                </div>
                <div className="mt-12 md:mt-0">
                    <h3 className="text-sm font-bold tracking-wider text-teal-600 uppercase">Home Owners</h3>
                    <ul role="list" className="mt-4 space-y-2">
                    <li>
                        <a href="https://www.wickedblocks.dev" className="text-base font-normal text-gray-500 hover:text-blue-600"> TBC </a>
                    </li>
                    </ul>
                </div>
                </div>
                <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                    <h3 className="text-sm font-bold tracking-wider text-teal-600 uppercase">Legal</h3>
                    <ul role="list" className="mt-4 space-y-2">
                    <li>
                        <a href="./changelog.html" className="text-base font-normal text-gray-500 hover:text-blue-600"> About</a>
                    </li>
                    <li>
                        <a href="./faq.html" className="text-base font-normal text-gray-500 hover:text-blue-600"> FAQ </a>
                    </li>
                    <li>
                        <a href="./refund.html" className="text-base font-normal text-gray-500 hover:text-blue-600"> Refund </a>
                    </li>
                    <li>
                        <a href="./license.html" className="text-base font-normal text-gray-500 hover:text-blue-600"> License </a>
                    </li>
                    <li>
                        <a href="./privacy.html" className="text-base font-normal text-gray-500 hover:text-blue-600"> Privacy Policy </a>
                    </li>
                    <li>
                        <a href="./terms.html" className="text-base font-normal text-gray-500 hover:text-blue-600"> Terms </a>
                    </li>
                    </ul>
                </div>
                <div className="mt-12 md:mt-0">
                    <h3 className="text-sm font-bold tracking-wider text-teal-600 uppercase">Socials</h3>
                    <ul role="list" className="mt-4 space-y-2">
                    <li>
                        <a href="https://twitter.com/WickedTemplates" className="text-base font-normal text-gray-500 hover:text-blue-600"> Twitter </a>
                    </li>
                    <li>
                        <a href="https://dribbble.com/MichaelAndreuzza.html" className="text-base font-normal text-gray-500 hover:text-blue-600"> Dribbble </a>
                    </li>
                    <li>
                        <a href="https://www.indiehackers.com/product/wicked-templates" className="text-base font-normal text-gray-500 hover:text-blue-600"> Indie Hackers </a>
                    </li>
                    </ul>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div className="px-4 py-12 mx-auto bg-gray-50 max-w-7xl sm:px-6 lg:px-16">
            <div className="flex flex-wrap items-baseline">
            <span className="mt-2 text-sm font-light text-gray-500">
                Copyright © 2020 - 2021
                <a href="https://wickedlabs.dev" className="mx-2 text-wickedblue hover:text-gray-500" rel="noopener noreferrer">@wickedlabsHQ</a>. Since 2020
            </span>
            </div>
        </div>
        </footer>
    )}

    export default Footer;
