import { Box, Button, Paper, Typography, TextField } from "@mui/material"
import { useState } from "react";

interface ITodoProps {
    id: number,
    name: string
}

export const TodoList = () => {
    const [value, setValue ] = useState('')
    const [tasks, setTasks] = useState<ITodoProps[]>([])

    const handleAddTask = () => {
        if(!value.trim()) return

        const task = {
            id: Date.now(),
            name: value
        }

        setTasks([...tasks, task])
        setValue('')
    }

    const handleDeleteTask = (id: number) => {
        setTasks(tasks.filter(task => task.id !== id))
    }

    return (

            <Paper 
                elevation={4} 
                sx={{ 
                    p: 4, 
                    borderRadius: 2,
                    width: '100%',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.08)'
                }}
            >
                <Typography 
                    variant="h4" 
                    sx={{ 
                        mb: 4, 
                        textAlign: 'center',
                        fontWeight: 600,
                        color: '#2c3e50',
                        letterSpacing: '0.5px'
                    }}
                >
                    Мой Туду Лист
                </Typography>
                
                <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
                    <TextField
                        fullWidth
                        value={value} 
                        onChange={(e)=> setValue(e.target.value)} 
                        placeholder="Что нужно сделать?"
                        variant="outlined"
                        size="medium"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                backgroundColor: '#fff',
                                '& fieldset': {
                                    borderColor: '#e1e8ed',
                                    transition: 'all 0.2s'
                                },
                                '&:hover fieldset': {
                                    borderColor: '#b1c4d0'
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#3498db',
                                    borderWidth: '1px'
                                }
                            }
                        }}
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleAddTask}
                        sx={{ 
                            minWidth: 120,
                            backgroundColor: '#3498db',
                            color: 'white',
                            fontWeight: 500,
                            borderRadius: 1.5,
                            textTransform: 'none',
                            boxShadow: '0 2px 10px rgba(52, 152, 219, 0.2)',
                            '&:hover': {
                                backgroundColor: '#2980b9',
                                boxShadow: '0 4px 15px rgba(52, 152, 219, 0.3)'
                            }
                        }}
                    >
                        Добавить
                    </Button>
                </Box>
                
                <Paper 
                    elevation={0} 
                    sx={{ 
                        borderRadius: 1.5,
                        border: '1px solid #e1e8ed',
                        maxHeight: 400,
                        overflow: 'auto',
                        backgroundColor: '#ffffff'
                    }}
                >
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {tasks.length === 0 ? (
                            <Box sx={{ p: 6, textAlign: "center" }}>
                                <Typography sx={{ 
                                    color: '#95a5a6',
                                    fontSize: '1.1rem',
                                    fontWeight: 400
                                }}>
                                    📝 Список задач пуст
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 1, color: '#bdc3c7' }}>
                                    Добавьте первую задачу
                                </Typography>
                            </Box>
                        ) : (
                            tasks.map((task, index) => (
                                <Box
                                    key={task.id}
                                    sx={{
                                        p: 2.5,
                                        borderBottom: index !== tasks.length - 1 ? '1px solid #f1f3f4' : 'none',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        '&:hover': {
                                            backgroundColor: '#f8fafc'
                                        }
                                    }}
                                    component="li"
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                        <Box
                                            sx={{
                                                width: 22,
                                                height: 22,
                                                borderRadius: '50%',
                                                border: '2px solid #3498db',
                                                mr: 2.5,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexShrink: 0,
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <Typography sx={{ 
                                                color: '#3498db', 
                                                fontSize: '0.75rem',
                                                fontWeight: 'bold'
                                            }}>
                                                ✓
                                            </Typography>
                                        </Box>
                                        <Typography 
                                            sx={{ 
                                                fontWeight: 400,
                                                fontSize: '1.05rem',
                                                color: '#2c3e50',
                                                wordBreak: 'break-word',
                                                pr: 2
                                            }}
                                        >
                                            {task.name}
                                        </Typography>
                                    </Box>
                                    <Button
                                        onClick={() => handleDeleteTask(task.id)}
                                        sx={{
                                            minWidth: 'auto',
                                            padding: 1,
                                            color: '#95a5a6',
                                            '&:hover': {
                                                backgroundColor: '#ffebee',
                                                color: '#e74c3c'
                                            }
                                        }}
                                    >
                                        ✕
                                    </Button>
                                </Box>
                            ))
                        )}
                    </ul>
                </Paper>
            </Paper>
    )
}