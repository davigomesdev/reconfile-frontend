import Toast from '../common/toast';
import { useToast } from '@/hooks/use-toast';

const Toaster: React.FC = () => {
  const { toasts } = useToast();

  return (
    <Toast.Provider>
      <Toast.Viewport>
        {toasts.map(function ({ id, title, description, action, ...props }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && <Toast.Title>{title}</Toast.Title>}
                {description && <Toast.Description>{description}</Toast.Description>}
              </div>
              {action}
              <Toast.Close />
            </Toast>
          );
        })}
      </Toast.Viewport>
    </Toast.Provider>
  );
};

export default Toaster;
