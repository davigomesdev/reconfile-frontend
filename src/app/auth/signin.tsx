import React from 'react';

import type { SignInDTO } from '@/services/api/auth/dtos/signin.dto';

import { PageUrlEnum } from '@/core/enums/page-url.enum';

import { ApiError } from '@/core/helpers/api-error';

import { cn } from '@/utils/cn.util';

import { signin } from '@/services/api/auth/auth.service';

import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';

import Form from '@/components/common/form';
import Toast from '@/components/common/toast';
import Input from '@/components/common/input';
import Spinner from '@/components/common/spinner';
import Separator from '@/components/common/separator';
import Typography from '@/components/common/typography';
import Button, { buttonVariants } from '@/components/common/button';

const schema = z.object({
  email: z.string().email('E-mail inválido').nonempty('E-mail obrigatória'),
  password: z.string().nonempty('Senha obrigatória'),
});

const SignIn: React.FC = () => {
  const { toast } = useToast();
  const { isLoading, reaload } = useAuth();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signinMutation = useMutation({
    mutationFn: async (input: SignInDTO) => signin(input),
    onSuccess: () => {
      reaload().then((response) => {
        if (response.data) {
          navigate(PageUrlEnum.HOME);
        }
      });
    },
    onError: (error) => {
      toast({
        title: 'Erro de autenticação!',
        description: error instanceof ApiError ? error.message : 'Ocorreu um erro inesperado.',
        action: <Toast.Action altText="Close">Ok</Toast.Action>,
        variant: 'destructive',
      });
    },
  });

  const handleOnSubmitSignIn = (values: z.infer<typeof schema>): void => {
    signinMutation.mutate(values);
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white p-5 py-16">
      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <div className="w-full max-w-[200px] pb-10">
          <img alt="logo" className="w-full" src="/logo.png" />
        </div>
        <div>
          <Typography.H3 className="text-center">Entre com sua conta</Typography.H3>
          <Typography.P className="text-center">
            Insira seus dados para entrar no sistema.
          </Typography.P>
        </div>
        <Form {...form}>
          <form
            autoComplete="off"
            className="w-full space-y-4"
            onSubmit={form.handleSubmit(handleOnSubmitSignIn)}
          >
            <Form.Field
              control={form.control}
              name="email"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>E-mail</Form.Label>
                  <Form.Control>
                    <Input placeholder="Digite seu endereço de e-mail" {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="password"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label>Senha</Form.Label>
                  <Form.Control>
                    <Input placeholder="Digite sua senha" type="password" {...field} />
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Button className="w-full" disabled={signinMutation.isPending || isLoading}>
              {signinMutation.isPending ? <Spinner /> : 'Entrar'}
            </Button>
            <div className="flex items-center gap-4">
              <Separator className="flex-1" />
              <Typography.P className="whitespace-nowrap">OU REGISTRA-SE</Typography.P>
              <Separator className="flex-1" />
            </div>
            <Link
              className={cn(buttonVariants({ variant: 'outline' }), 'w-full')}
              to={PageUrlEnum.SIGNUP}
            >
              Criar nova conta
            </Link>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default SignIn;
