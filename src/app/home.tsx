import React from 'react';

import type { ChartConfig } from '@/components/common/chart';
import type { ImportSuppliersDTO } from '@/services/api/supplier/dtos/import-suppliers.dto';

import { FormDataFields } from '@/core/helpers/form-data-fields';

import { ApiError } from '@/core/helpers/api-error';

import { cn } from '@/utils/cn.util';
import { Decimal } from 'decimal.js';
import { getParams } from '@/utils/url.util';
import { buttonVariants } from '@/components/common/button';

import { importSuppliers } from '@/services/api/supplier/supplier.service';

import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { useDebounce } from '@/hooks/use-debounce';
import { useSearchParams } from 'react-router-dom';
import { useSuppliersData } from '@/hooks/use-suppliers-data';
import { useOverviewSuppliersData } from '@/hooks/use-overview-suppliers-data';

import { BadgeCheck, CreditCard, FileUp, LayoutList, Users } from 'lucide-react';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import Card from '@/components/common/card';
import Chart from '@/components/common/chart';
import Toast from '@/components/common/toast';
import Spinner from '@/components/common/spinner';
import TableGrid from '@/components/common/table-grid';
import Separator from '@/components/common/separator';
import Typography from '@/components/common/typography';
import InputSearch from '@/components/common/input-search';
import Pagination, { renderPaginationLinks } from '@/components/common/pagination';
import { formatDateToBR } from '@/utils/format.util';

const chartConfig = {
  applied: {
    label: 'Valor aplicado',
    color: '#7bf1a8',
  },
  gain: {
    label: 'Valor ganho',
    color: '#7bf1a8',
  },
} satisfies ChartConfig;

const Home: React.FC = () => {
  const { toast } = useToast();

  const [searchParams] = useSearchParams();
  const params = getParams(searchParams);

  const debouncedInputSearch = useDebounce<string>(params.filter, 150);

  const suppliersData = useSuppliersData({
    page: params.page ? Number(params.page) : undefined,
    filter: debouncedInputSearch || undefined,
  });

  const overviewSuppliersData = useOverviewSuppliersData();

  const importSuppliersMutation = useMutation({
    mutationFn: async (input: FormDataFields<ImportSuppliersDTO>) => importSuppliers(input),
    onSuccess: () => {
      toast({
        title: 'Sucesso!',
        description: 'Planilha importada com sucesso.',
        action: <Toast.Action altText="Fechar">Ok</Toast.Action>,
      });
      suppliersData.refetch();
      overviewSuppliersData.refetch();
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

  const handleOnChangeImportSuppliers = (file: File): void => {
    importSuppliersMutation.mutate(
      new FormDataFields<ImportSuppliersDTO>({
        file: file,
      }),
    );
  };

  if (!suppliersData.query || !overviewSuppliersData.query)
    return (
      <main className="flex h-full w-full items-center justify-center">
        <Spinner size="xg" variant="black" />
      </main>
    );

  return (
    <main className="w-full space-y-5">
      <section className="w-full">
        <Typography.H2>Fornecedores</Typography.H2>
      </section>
      <Separator />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <Card.Content className="flex items-center justify-center gap-4 p-5">
            <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full border border-blue-500 text-blue-500 [&_svg]:size-10">
              <LayoutList />
            </div>
            <div className="space-y-1">
              <Card.Title className="text-2xl">
                {overviewSuppliersData.query.data.totalRecords}
              </Card.Title>
              <Card.Description>Total Records</Card.Description>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex items-center justify-center gap-4 p-5">
            <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full border border-green-500 text-green-500 [&_svg]:size-10">
              <CreditCard />
            </div>
            <div className="space-y-1">
              <Card.Title className="text-2xl">
                {new Decimal(overviewSuppliersData.query.data.totalBilling)
                  .toDecimalPlaces(2)
                  .toString()}{' '}
                USD
              </Card.Title>
              <Card.Description>Total Billing</Card.Description>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex items-center justify-center gap-4 p-5">
            <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full border border-blue-200 text-blue-200 [&_svg]:size-10">
              <BadgeCheck />
            </div>
            <div className="space-y-1">
              <Card.Title className="text-2xl">
                {overviewSuppliersData.query.data.totalSubscribers}
              </Card.Title>
              <Card.Description>Total Subscribers</Card.Description>
            </div>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex items-center justify-center gap-4 p-5">
            <div className="flex h-[70px] w-[70px] items-center justify-center rounded-full border border-green-700 text-green-700 [&_svg]:size-10">
              <Users />
            </div>
            <div className="space-y-1">
              <Card.Title className="text-2xl">
                {overviewSuppliersData.query.data.totalCustomers}
              </Card.Title>
              <Card.Description>Total Customers</Card.Description>
            </div>
          </Card.Content>
        </Card>
      </section>
      <section>
        <Card>
          <Card.Header />
          <Card.Content>
            <Chart className="max-h-[300px] min-h-[150px] w-full" config={chartConfig}>
              <BarChart
                data={overviewSuppliersData.query.data.billingByMonth.map((item) => ({
                  yearMonth: item.yearMonth,
                  billing: new Decimal(item.total).toDecimalPlaces(2).toNumber(),
                }))}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="yearMonth"
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return `${month}/${year.slice(2)}`;
                  }}
                  tickLine={false}
                  tickMargin={10}
                />
                <Chart.Tooltip
                  content={({ payload }) => {
                    if (!payload || payload.length === 0) return null;

                    return (
                      <div className="rounded-md border bg-white p-3 shadow-md">
                        {payload.map((entry, index) => (
                          <div key={index} className="text-sm text-gray-700">
                            <strong>{entry.name}:</strong> {entry.value} USD
                          </div>
                        ))}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="billing" fill="#6e44d9" radius={4} />
              </BarChart>
            </Chart>
          </Card.Content>
        </Card>
      </section>
      <section>
        <Card>
          <Card.Content className="flex items-center justify-between gap-2 p-5">
            <div className="w-full max-w-[400px]">
              <InputSearch placeholder="Pesquisar por cliente" />
            </div>
            <div className="relative flex flex-col items-center gap-4 md:flex-row">
              <input
                accept=".xlsx"
                className="absolute inset-0 hidden h-full w-full cursor-pointer opacity-0"
                id="file-input"
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleOnChangeImportSuppliers(file);
                  }
                  e.target.value = '';
                }}
              />
              <label
                className={cn(
                  buttonVariants(),
                  'w-full cursor-pointer',
                  importSuppliersMutation.isPending && 'pointer-events-none opacity-50',
                )}
                htmlFor="file-input"
              >
                {importSuppliersMutation.isPending ? (
                  <Spinner />
                ) : (
                  <>
                    <FileUp />
                    Importar planilha
                  </>
                )}
              </label>
            </div>
          </Card.Content>
        </Card>
      </section>
      <section>
        {suppliersData.query.data.length > 0 ? (
          <>
            <Card>
              <TableGrid>
                <TableGrid.Header>
                  <TableGrid.HeaderRow>
                    <TableGrid.HeaderCell>Partner ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Partner Name</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Customer Name</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Customer Domain Name</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>MPN ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Invoice Number</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Product ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Sku ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Availability ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Sku Name</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Product Name</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Publisher Name</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Publisher ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Subscription Description</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Subscription ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Charge Start Date</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Charge End Date</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Usage Date</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Meter Type</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Meter Category</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Meter ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Meter Name</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Meter Region</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Unit</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Resource Location</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Consumed Service</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Resource Group</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Resource URI</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Charge Type</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Unit Price</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Quantity</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Unit Type</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Billing Pre Tax Total</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Billing Currency</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Pricing Pre Tax Total</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Pricing Currency</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Service Info 1</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Service Info 2</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Tags</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Additional Info</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Effective Unit Price</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>PCTo BC Exchange Rate</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>PCTo BC Exchange Rate Date</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Entitlement ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Entitlement Description</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Partner Earned Credit Percentage</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Credit Percentage</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Credit Type</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Benefit Order ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Benefit ID</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell>Benefit Type</TableGrid.HeaderCell>
                    <TableGrid.HeaderCell />
                  </TableGrid.HeaderRow>
                </TableGrid.Header>
                <TableGrid.Body>
                  {suppliersData.query.data.map((suppliers) => (
                    <TableGrid.BodyRow key={suppliers.id}>
                      <TableGrid.BodyCell>{suppliers.partnerId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.partnerName}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.customerName}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.customerDomainName}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.mpnId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.invoiceNumber}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.productId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.skuId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.availabilityId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.skuName}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.productName}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.publisherName}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.publisherId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.subscriptionDescription}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.subscriptionId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>
                        {formatDateToBR(suppliers.chargeStartDate)}
                      </TableGrid.BodyCell>
                      <TableGrid.BodyCell>
                        {formatDateToBR(suppliers.chargeEndDate)}
                      </TableGrid.BodyCell>
                      <TableGrid.BodyCell>{formatDateToBR(suppliers.usageDate)}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.meterType}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.meterCategory}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.meterId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.meterName}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.meterRegion}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.unit}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.resourceLocation}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.consumedService}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.resourceGroup}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.resourceURI}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.chargeType}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.unitPrice}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.quantity}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.unitType}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.billingPreTaxTotal}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.billingCurrency}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.pricingPreTaxTotal}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.pricingCurrency}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.serviceInfo1}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.serviceInfo2}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>
                        {suppliers.tags ? JSON.stringify(suppliers.tags) : ''}
                      </TableGrid.BodyCell>
                      <TableGrid.BodyCell>
                        {suppliers.additionalInfo ? JSON.stringify(suppliers.additionalInfo) : ''}
                      </TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.effectiveUnitPrice}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.pctoBCExchangeRate}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>
                        {formatDateToBR(suppliers.pctoBCExchangeRateDate)}
                      </TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.entitlementId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.entitlementDescription}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>
                        {suppliers.partnerEarnedCreditPercentage}
                      </TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.creditPercentage}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.creditType}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.benefitOrderId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.benefitId}</TableGrid.BodyCell>
                      <TableGrid.BodyCell>{suppliers.benefitType}</TableGrid.BodyCell>
                      <TableGrid.BodyCell />
                    </TableGrid.BodyRow>
                  ))}
                </TableGrid.Body>
              </TableGrid>
            </Card>
            <div className="mt-5 flex w-full justify-center">
              <Pagination>
                <Pagination.Prev currentPage={suppliersData.query.meta.currentPage} />
                {renderPaginationLinks(
                  suppliersData.query.meta.currentPage,
                  suppliersData.query.meta.lastPage,
                )}
                <Pagination.Next
                  currentPage={suppliersData.query.meta.currentPage}
                  lastPage={suppliersData.query.meta.lastPage}
                />
              </Pagination>
            </div>
          </>
        ) : (
          <Card className="flex flex-col items-center justify-center px-5 py-16">
            <Typography.H3 className="text-center">Nenhum registro encontrado!</Typography.H3>
            <Typography.P className="text-center">
              Clique abaixo para importar planilha.
            </Typography.P>
            <div className="mt-10">
              <div className="relative flex flex-col items-center gap-4 md:flex-row">
                <input
                  accept=".xlsx"
                  className="absolute inset-0 hidden h-full w-full cursor-pointer opacity-0"
                  id="file-input"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleOnChangeImportSuppliers(file);
                    }
                    e.target.value = '';
                  }}
                />
                <label
                  className={cn(
                    buttonVariants(),
                    'w-full cursor-pointer',
                    importSuppliersMutation.isPending && 'pointer-events-none opacity-50',
                  )}
                  htmlFor="file-input"
                >
                  {importSuppliersMutation.isPending ? (
                    <>Importando dados...</>
                  ) : (
                    <>
                      <FileUp />
                      Importar planilha
                    </>
                  )}
                </label>
              </div>
            </div>
          </Card>
        )}
      </section>
    </main>
  );
};

export default Home;
