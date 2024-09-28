

const SlidesPage = async ({params}: { params: { id: string } }) => {
    const {id} = params;
    console.log(id);
    return (
        <div>
            <h1>Slides Page</h1>
            <p>ID: {id}</p>
        </div>
    );
}

export default SlidesPage;