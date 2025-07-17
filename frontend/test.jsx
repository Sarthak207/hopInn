// Create a simple test component
const TestAPI = () => {
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    
    const testAPI = async () => {
        try {
            const response = await fetch('http://localhost:3000/campus/locations', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message);
        }
    };
    
    return (
        <>
            <button onClick={testAPI}>Test Campus API</button>
            {error && <div>Error: {error}</div>}
            {result && <div>Success: {result.count} locations found</div>}
        </>
    );
};
