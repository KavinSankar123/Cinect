import React from 'react';
import { Typography, Button, Card, CardContent, CardMedia, Box } from '@mui/material';

function Recommendations({ recommendation, getRecommendation, poster }) {
    const altText = poster === "N/A" || poster == null ? "Poster for movie not found" : "";

    return (
        <Box sx={{ maxWidth: 600, width: '100%' }}> {/* Updated maxWidth and width */}
            <Card>
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        Your Recommendation
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Insert plot summary, keywords...
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.primary">
                        Recommendation: {recommendation}
                    </Typography>
                    <Button variant="contained" onClick={getRecommendation} fullWidth>
                        Get Recommendation
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Recommendations;