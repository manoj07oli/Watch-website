import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalDrink, Add } from '@mui/icons-material';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Grid,
  IconButton,
} from '@mui/material';
import { motion } from 'framer-motion';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
});

interface WaterIntake {
  amount: number;
  timestamp: string;
}

const App: React.FC = () => {
  const [dailyGoal, setDailyGoal] = useState<number>(2000); // in ml
  const [currentIntake, setCurrentIntake] = useState<number>(0);
  const [intakeHistory, setIntakeHistory] = useState<WaterIntake[]>([]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  useEffect(() => {
    const savedGoal = localStorage.getItem('dailyGoal');
    const savedIntake = localStorage.getItem('currentIntake');
    const savedHistory = localStorage.getItem('intakeHistory');

    if (savedGoal) setDailyGoal(parseInt(savedGoal));
    if (savedIntake) setCurrentIntake(parseInt(savedIntake));
    if (savedHistory) setIntakeHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyGoal', dailyGoal.toString());
    localStorage.setItem('currentIntake', currentIntake.toString());
    localStorage.setItem('intakeHistory', JSON.stringify(intakeHistory));
  }, [dailyGoal, currentIntake, intakeHistory]);

  const addWater = (amount: number) => {
    const newIntake = currentIntake + amount;
    setCurrentIntake(newIntake);
    setIntakeHistory([
      ...intakeHistory,
      { amount, timestamp: new Date().toISOString() },
    ]);
  };

  const progress = (currentIntake / dailyGoal) * 100;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Box sx={{ py: 4 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
          >
            <Typography variant="h4" component="h1" gutterBottom align="center">
              HydroTracker
            </Typography>

            <Paper
              elevation={3}
              sx={{
                p: 3,
                mt: 3,
                borderRadius: 2,
                background: 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ position: 'relative', mb: 3 }}>
                  <CircularProgress
                    variant="determinate"
                    value={progress}
                    size={200}
                    thickness={4}
                    sx={{ color: theme.palette.primary.main }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                    }}
                  >
                    <LocalDrink sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6">
                      {currentIntake}ml / {dailyGoal}ml
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2} justifyContent="center">
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => addWater(250)}
                      startIcon={<Add />}
                    >
                      250ml
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="contained"
                      onClick={() => addWater(500)}
                      startIcon={<Add />}
                    >
                      500ml
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                Today's History
              </Typography>
              {intakeHistory.length === 0 ? (
                <Typography color="text.secondary">
                  No water intake recorded today
                </Typography>
              ) : (
                intakeHistory.map((intake, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: index !== intakeHistory.length - 1 ? '1px solid #eee' : 'none',
                    }}
                  >
                    <Typography>
                      {new Date(intake.timestamp).toLocaleTimeString()}
                    </Typography>
                    <Typography>{intake.amount}ml</Typography>
                  </Box>
                ))
              )}
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App; 