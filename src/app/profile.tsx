import React from 'react';

import type { UpdateCurrentUserDTO } from '@/services/api/user/dtos/update-current-user.dto';
import type { UpdatePasswordUserDTO } from '@/services/api/user/dtos/update-password-user.dto';

import { ApiError } from '@/core/helpers/api-error';

import { updateCurrentUser, updatePasswordUser } from '@/services/api/user/user.service';

import { useAuth } from '@/hooks/use-auth';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import Form from '@/components/common/form';
import Card from '@/components/common/card';
import Toast from '@/components/common/toast';
import Input from '@/components/common/input';
import Button from '@/components/common/button';
import Spinner from '@/components/common/spinner';
import Separator from '@/components/common/separator';
import Typography from '@/components/common/typography';

const schemaUpdateCurrentUser = z.object({
  name: z.string().nonempty('Nome obrigatório'),
  email: z.string().email('E-mail inválido').nonempty('E-mail obrigatório'),
});

const schemaUpdatePasswordUser = z.object({
  oldPassword: z.string().nonempty('Senha atual obrigatória'),
  newPassword: z
    .string()
    .nonempty('Nova senha obrigatória')
    .min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

const Profile: React.FC = () => {
  const { toast } = useToast();
  const { auth, reaload } = useAuth();

  const formUpdateCurrentUser = useForm<z.infer<typeof schemaUpdateCurrentUser>>({
    resolver: zodResolver(schemaUpdateCurrentUser),
  });

  const formUpdatePasswordUser = useForm<z.infer<typeof schemaUpdatePasswordUser>>({
    resolver: zodResolver(schemaUpdatePasswordUser),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
    },
  });

  const updateCurrentUserMutation = useMutation({
    mutationFn: async (input: UpdateCurrentUserDTO) => {
      return await updateCurrentUser(input);
    },
    onSuccess: () => {
      reaload();
      toast({
        title: 'Sucesso!',
        description: 'Usuário atualizado com sucesso!',
        action: <Toast.Action altText="Fechar">Ok</Toast.Action>,
      });
    },
    onError: (error) => {
      toast({
        title: 'Ocorreu um erro!',
        description: error instanceof ApiError ? error.message : 'Ocorreu um erro inesperado.',
        action: <Toast.Action altText="Fechar">Ok</Toast.Action>,
        variant: 'destructive',
      });
    },
  });

  const updatePasswordUserMutation = useMutation({
    mutationFn: async (input: UpdatePasswordUserDTO) => {
      return await updatePasswordUser(input);
    },
    onSuccess: () => {
      reaload();
      toast({
        title: 'Sucesso',
        description: 'Senha atualizada com sucesso!',
        action: <Toast.Action altText="Fechar">Ok</Toast.Action>,
      });
    },
    onError: (error) => {
      toast({
        title: 'Ocorreu um erro!',
        description: error instanceof ApiError ? error.message : 'Ocorreu um erro inesperado.',
        action: <Toast.Action altText="Fechar">Ok</Toast.Action>,
        variant: 'destructive',
      });
    },
  });

  const handleOnSubmitUpdateCurrentUser = (
    values: z.infer<typeof schemaUpdateCurrentUser>,
  ): void => {
    updateCurrentUserMutation.mutate(values);
  };

  const handleOnSubmitUpdatePasswordUser = (
    values: z.infer<typeof schemaUpdatePasswordUser>,
  ): void => {
    updatePasswordUserMutation.mutate(values);
  };

  if (!auth)
    return (
      <main className="flex h-full w-full items-center justify-center">
        <Spinner size="xg" variant="black" />
      </main>
    );

  return (
    <main className="flex w-full flex-col items-center space-y-5">
      <section className="w-full">
        <Typography.H2>Configurações</Typography.H2>
      </section>
      <Separator />
      <section className="w-full max-w-4xl space-y-5">
        <Form {...formUpdateCurrentUser}>
          <form
            className="space-y-5"
            onSubmit={formUpdateCurrentUser.handleSubmit(handleOnSubmitUpdateCurrentUser)}
          >
            <Card>
              <Card.Header>
                <Card.Title>Informações pessoais</Card.Title>
                <Card.Description>
                  Dados essenciais para identificação e personalização do usuário.
                </Card.Description>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4 md:flex-row">
                <Form.Field
                  control={formUpdateCurrentUser.control}
                  defaultValue={auth.name}
                  name="name"
                  render={({ field }) => (
                    <Form.Item className="w-full md:max-w-[300px]">
                      <Form.Label>Nome</Form.Label>
                      <Form.Control>
                        <Input placeholder="Digite seu nome" {...field} />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={formUpdateCurrentUser.control}
                  defaultValue={auth.email}
                  name="email"
                  render={({ field }) => (
                    <Form.Item className="w-full md:max-w-[300px]">
                      <Form.Label>E-mail</Form.Label>
                      <Form.Control>
                        <Input placeholder="Digite seu e-mail" {...field} />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
              </Card.Content>
              <Card.Footer className="flex items-center justify-between gap-4 border-t border-neutral-200 bg-neutral-100 py-5">
                <Card.Description>Preencha todos os campos corretamente.</Card.Description>
                <Button disabled={updateCurrentUserMutation.isPending}>
                  {updateCurrentUserMutation.isPending ? <Spinner /> : 'Salvar'}
                </Button>
              </Card.Footer>
            </Card>
          </form>
        </Form>
        <Form {...formUpdatePasswordUser}>
          <form onSubmit={formUpdatePasswordUser.handleSubmit(handleOnSubmitUpdatePasswordUser)}>
            <Card>
              <Card.Header>
                <Card.Title>Senha</Card.Title>
                <Card.Description>Altere sua senha.</Card.Description>
              </Card.Header>
              <Card.Content className="flex flex-col gap-4 md:flex-row">
                <Form.Field
                  control={formUpdatePasswordUser.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <Form.Item className="w-full md:max-w-[300px]">
                      <Form.Label>Senha atual</Form.Label>
                      <Form.Control>
                        <Input placeholder="Digite sua senha atual" type="password" {...field} />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={formUpdatePasswordUser.control}
                  name="newPassword"
                  render={({ field }) => (
                    <Form.Item className="w-full md:max-w-[300px]">
                      <Form.Label>Nova senha</Form.Label>
                      <Form.Control>
                        <Input placeholder="Digite uma nova senha" type="password" {...field} />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  )}
                />
              </Card.Content>
              <Card.Footer className="flex items-center justify-between gap-4 border-t border-neutral-200 bg-neutral-100 py-5">
                <Card.Description>Adicione uma senha forte.</Card.Description>
                <Button disabled={updatePasswordUserMutation.isPending}>
                  {updatePasswordUserMutation.isPending ? <Spinner /> : 'Salvar'}
                </Button>
              </Card.Footer>
            </Card>
          </form>
        </Form>
      </section>
    </main>
  );
};

export default Profile;
