export function Footer() {
    return (
        <footer className="bg-white shadow mt-auto">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 text-sm">
                    © {new Date().getFullYear()} Threat Intelligence Platform. All rights reserved.
                </p>
            </div>
        </footer>
    )
}