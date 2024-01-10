import { AppBar, Toolbar, Typography, IconButton, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface IContainerProps {
 title: string;
 children: React.ReactNode;
}

const ContainerComponent: React.FC<IContainerProps> = ({ title, children }) => {
 return (
    <Container maxWidth="lg">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      {children}
    </Container>
 );
};

export default ContainerComponent;