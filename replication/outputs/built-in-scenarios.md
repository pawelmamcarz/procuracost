# ProcuraCost 2.3 replication package

Declared ranges are not confidence intervals.

Deterministic outputs are not empirical estimates.

- Schema version: `2`
- Model version: `2.3.0`
- Calibration identifier: `source-scenario-2026-08-28`
- Legal ruleset identifier: `pl-pzp-2026-2027`
- Currency: `PLN`

## `fleet_tco_reframing`

### Cost comparison

- Difference operation: `formalSequential_minus_adaptiveCompliant`
- Central cost difference: -190453.93 PLN
- Outer difference range: -865453.93 / 759546.07 PLN

### Coverage anchors

- `role_cost`: `alternatives.formalSequential.workflowDesign.steps[0].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.executive`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.executive`, `roleHourlyRates.requestor`, `roleHourlyRates.buyer`, `roleHourlyRates.lawyer`, `roleHourlyRates.finance`, `roleHourlyRates.manager`, `roleHourlyRates.executive`
- `non_labour_cost`: `alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[2].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[3].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[4].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[5].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].nonLabourCost`
- `delay_cost`: `alternatives.formalSequential.workflowDesign.steps[0].activeDays`, `alternatives.formalSequential.workflowDesign.steps[0].queueDays`, `alternatives.formalSequential.workflowDesign.steps[1].activeDays`, `alternatives.formalSequential.workflowDesign.steps[1].queueDays`, `alternatives.formalSequential.workflowDesign.steps[2].activeDays`, `alternatives.formalSequential.workflowDesign.steps[2].queueDays`, `alternatives.formalSequential.workflowDesign.steps[3].activeDays`, `alternatives.formalSequential.workflowDesign.steps[3].queueDays`, `alternatives.formalSequential.workflowDesign.steps[4].activeDays`, `alternatives.formalSequential.workflowDesign.steps[4].queueDays`, `alternatives.formalSequential.workflowDesign.steps[5].activeDays`, `alternatives.formalSequential.workflowDesign.steps[5].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].queueDays`, `dailyCostOfInaction`
- `competition_transfer`: `alternatives.formalSequential.contractDesign.dimensions[0].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost`
- `contract_amendment`: `alternatives.formalSequential.contractDesign.dimensions[1].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost`
- `tco`: `alternatives.formalSequential.contractDesign.dimensions[2].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost`

### Non-monetised dimensions

- `informal_bypass`

### Migration status

- Native model 2.3 record

### Legal provenance

- None

## `erp_transformation_discovery`

### Cost comparison

- Difference operation: `formalSequential_minus_adaptiveCompliant`
- Central cost difference: 24534.89 PLN
- Outer difference range: -1055615.11 / 1559034.89 PLN

### Coverage anchors

- `role_cost`: `alternatives.formalSequential.workflowDesign.steps[0].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.executive`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.executive`, `roleHourlyRates.requestor`, `roleHourlyRates.buyer`, `roleHourlyRates.lawyer`, `roleHourlyRates.finance`, `roleHourlyRates.manager`, `roleHourlyRates.executive`
- `non_labour_cost`: `alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[2].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[3].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[4].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[5].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].nonLabourCost`
- `delay_cost`: `alternatives.formalSequential.workflowDesign.steps[0].activeDays`, `alternatives.formalSequential.workflowDesign.steps[0].queueDays`, `alternatives.formalSequential.workflowDesign.steps[1].activeDays`, `alternatives.formalSequential.workflowDesign.steps[1].queueDays`, `alternatives.formalSequential.workflowDesign.steps[2].activeDays`, `alternatives.formalSequential.workflowDesign.steps[2].queueDays`, `alternatives.formalSequential.workflowDesign.steps[3].activeDays`, `alternatives.formalSequential.workflowDesign.steps[3].queueDays`, `alternatives.formalSequential.workflowDesign.steps[4].activeDays`, `alternatives.formalSequential.workflowDesign.steps[4].queueDays`, `alternatives.formalSequential.workflowDesign.steps[5].activeDays`, `alternatives.formalSequential.workflowDesign.steps[5].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].queueDays`, `dailyCostOfInaction`
- `competition_transfer`: `alternatives.formalSequential.contractDesign.dimensions[0].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost`
- `contract_amendment`: `alternatives.formalSequential.contractDesign.dimensions[1].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost`
- `tco`: `alternatives.formalSequential.contractDesign.dimensions[2].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost`

### Non-monetised dimensions

- `informal_bypass`

### Migration status

- Native model 2.3 record

### Legal provenance

- None

## `logistics_service_redesign`

### Cost comparison

- Difference operation: `formalSequential_minus_adaptiveCompliant`
- Central cost difference: -433713.10 PLN
- Outer difference range: -862713.10 / 156286.90 PLN

### Coverage anchors

- `role_cost`: `alternatives.formalSequential.workflowDesign.steps[0].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.executive`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.executive`, `roleHourlyRates.requestor`, `roleHourlyRates.buyer`, `roleHourlyRates.lawyer`, `roleHourlyRates.finance`, `roleHourlyRates.manager`, `roleHourlyRates.executive`
- `non_labour_cost`: `alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[2].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[3].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[4].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[5].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].nonLabourCost`
- `delay_cost`: `alternatives.formalSequential.workflowDesign.steps[0].activeDays`, `alternatives.formalSequential.workflowDesign.steps[0].queueDays`, `alternatives.formalSequential.workflowDesign.steps[1].activeDays`, `alternatives.formalSequential.workflowDesign.steps[1].queueDays`, `alternatives.formalSequential.workflowDesign.steps[2].activeDays`, `alternatives.formalSequential.workflowDesign.steps[2].queueDays`, `alternatives.formalSequential.workflowDesign.steps[3].activeDays`, `alternatives.formalSequential.workflowDesign.steps[3].queueDays`, `alternatives.formalSequential.workflowDesign.steps[4].activeDays`, `alternatives.formalSequential.workflowDesign.steps[4].queueDays`, `alternatives.formalSequential.workflowDesign.steps[5].activeDays`, `alternatives.formalSequential.workflowDesign.steps[5].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].queueDays`, `dailyCostOfInaction`
- `competition_transfer`: `alternatives.formalSequential.contractDesign.dimensions[0].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost`
- `contract_amendment`: `alternatives.formalSequential.contractDesign.dimensions[1].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost`
- `tco`: `alternatives.formalSequential.contractDesign.dimensions[2].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost`

### Non-monetised dimensions

- `informal_bypass`

### Migration status

- Native model 2.3 record

### Legal provenance

- None

## `critical_material_continuity`

### Cost comparison

- Difference operation: `formalSequential_minus_adaptiveCompliant`
- Central cost difference: 703838.83 PLN
- Outer difference range: -7006161.17 / 11683838.83 PLN

### Coverage anchors

- `role_cost`: `alternatives.formalSequential.workflowDesign.steps[0].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.executive`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.executive`, `roleHourlyRates.requestor`, `roleHourlyRates.buyer`, `roleHourlyRates.lawyer`, `roleHourlyRates.finance`, `roleHourlyRates.manager`, `roleHourlyRates.executive`
- `non_labour_cost`: `alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[2].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[3].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[4].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[5].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].nonLabourCost`
- `delay_cost`: `alternatives.formalSequential.workflowDesign.steps[0].activeDays`, `alternatives.formalSequential.workflowDesign.steps[0].queueDays`, `alternatives.formalSequential.workflowDesign.steps[1].activeDays`, `alternatives.formalSequential.workflowDesign.steps[1].queueDays`, `alternatives.formalSequential.workflowDesign.steps[2].activeDays`, `alternatives.formalSequential.workflowDesign.steps[2].queueDays`, `alternatives.formalSequential.workflowDesign.steps[3].activeDays`, `alternatives.formalSequential.workflowDesign.steps[3].queueDays`, `alternatives.formalSequential.workflowDesign.steps[4].activeDays`, `alternatives.formalSequential.workflowDesign.steps[4].queueDays`, `alternatives.formalSequential.workflowDesign.steps[5].activeDays`, `alternatives.formalSequential.workflowDesign.steps[5].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].queueDays`, `dailyCostOfInaction`
- `competition_transfer`: `alternatives.formalSequential.contractDesign.dimensions[0].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost`
- `contract_amendment`: `alternatives.formalSequential.contractDesign.dimensions[1].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost`
- `tco`: `alternatives.formalSequential.contractDesign.dimensions[2].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost`

### Non-monetised dimensions

- `informal_bypass`

### Migration status

- Native model 2.3 record

### Legal provenance

- None

## `public_it_open_with_market_consultation`

### Cost comparison

- Difference operation: `formalSequential_minus_adaptiveCompliant`
- Central cost difference: -128337.62 PLN
- Outer difference range: -3060837.62 / 3214162.38 PLN

### Coverage anchors

- `role_cost`: `alternatives.formalSequential.workflowDesign.steps[0].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.executive`, `alternatives.formalSequential.workflowDesign.steps[7].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[7].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[7].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[7].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[7].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[7].roleHours.executive`, `roleHourlyRates.requestor`, `roleHourlyRates.buyer`, `roleHourlyRates.lawyer`, `roleHourlyRates.finance`, `roleHourlyRates.manager`, `roleHourlyRates.executive`
- `non_labour_cost`: `alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[2].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[3].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[4].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[5].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[6].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[7].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[6].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[7].nonLabourCost`
- `delay_cost`: `alternatives.formalSequential.workflowDesign.steps[0].activeDays`, `alternatives.formalSequential.workflowDesign.steps[0].queueDays`, `alternatives.formalSequential.workflowDesign.steps[1].activeDays`, `alternatives.formalSequential.workflowDesign.steps[1].queueDays`, `alternatives.formalSequential.workflowDesign.steps[2].activeDays`, `alternatives.formalSequential.workflowDesign.steps[2].queueDays`, `alternatives.formalSequential.workflowDesign.steps[3].activeDays`, `alternatives.formalSequential.workflowDesign.steps[3].queueDays`, `alternatives.formalSequential.workflowDesign.steps[4].activeDays`, `alternatives.formalSequential.workflowDesign.steps[4].queueDays`, `alternatives.formalSequential.workflowDesign.steps[5].activeDays`, `alternatives.formalSequential.workflowDesign.steps[5].queueDays`, `alternatives.formalSequential.workflowDesign.steps[6].activeDays`, `alternatives.formalSequential.workflowDesign.steps[6].queueDays`, `alternatives.formalSequential.workflowDesign.steps[7].activeDays`, `alternatives.formalSequential.workflowDesign.steps[7].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[6].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[6].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[7].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[7].queueDays`, `dailyCostOfInaction`
- `competition_transfer`: `alternatives.formalSequential.contractDesign.dimensions[0].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost`
- `contract_amendment`: `alternatives.formalSequential.contractDesign.dimensions[1].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost`
- `tco`: `alternatives.formalSequential.contractDesign.dimensions[2].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost`

### Non-monetised dimensions

- `informal_bypass`

### Migration status

- Native model 2.3 record

### Legal provenance

- `pl-pzp-art-138-1` (PZP art. 138 ust. 1): `formalSequential/legal.pzp_open.bid_submission`, `adaptiveCompliant/legal.pzp_open.bid_submission`
- `pl-pzp-art-264-1` (PZP art. 264 ust. 1): `formalSequential/legal.pzp_open.standstill`, `adaptiveCompliant/legal.pzp_open.standstill`

## `stable_private_standard_service`

### Cost comparison

- Difference operation: `formalSequential_minus_adaptiveCompliant`
- Central cost difference: -300000.00 PLN
- Outer difference range: -450000.00 / -100000.00 PLN

### Coverage anchors

- `role_cost`: `alternatives.formalSequential.workflowDesign.steps[0].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.lawyer`, `roleHourlyRates.requestor`, `roleHourlyRates.buyer`, `roleHourlyRates.lawyer`, `roleHourlyRates.finance`, `roleHourlyRates.manager`, `roleHourlyRates.executive`
- `non_labour_cost`: `alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[2].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[3].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].nonLabourCost`
- `delay_cost`: `alternatives.formalSequential.workflowDesign.steps[0].activeDays`, `alternatives.formalSequential.workflowDesign.steps[0].queueDays`, `alternatives.formalSequential.workflowDesign.steps[1].activeDays`, `alternatives.formalSequential.workflowDesign.steps[1].queueDays`, `alternatives.formalSequential.workflowDesign.steps[2].activeDays`, `alternatives.formalSequential.workflowDesign.steps[2].queueDays`, `alternatives.formalSequential.workflowDesign.steps[3].activeDays`, `alternatives.formalSequential.workflowDesign.steps[3].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].queueDays`, `dailyCostOfInaction`
- `competition_transfer`: `alternatives.formalSequential.contractDesign.dimensions[0].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost`
- `contract_amendment`: `alternatives.formalSequential.contractDesign.dimensions[1].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost`
- `tco`: `alternatives.formalSequential.contractDesign.dimensions[2].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost`

### Non-monetised dimensions

- `informal_bypass`

### Migration status

- Native model 2.3 record

### Legal provenance

- None

## `stable_capex_replacement`

### Cost comparison

- Difference operation: `formalSequential_minus_adaptiveCompliant`
- Central cost difference: -392024.29 PLN
- Outer difference range: -5527424.29 / 6003075.71 PLN

### Coverage anchors

- `role_cost`: `alternatives.formalSequential.workflowDesign.steps[0].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.executive`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.executive`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.executive`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[6].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[6].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[6].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[6].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[6].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[6].roleHours.executive`, `roleHourlyRates.requestor`, `roleHourlyRates.buyer`, `roleHourlyRates.lawyer`, `roleHourlyRates.finance`, `roleHourlyRates.manager`, `roleHourlyRates.executive`
- `non_labour_cost`: `alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[2].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[3].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[4].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[5].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[6].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[6].nonLabourCost`
- `delay_cost`: `alternatives.formalSequential.workflowDesign.steps[0].activeDays`, `alternatives.formalSequential.workflowDesign.steps[0].queueDays`, `alternatives.formalSequential.workflowDesign.steps[1].activeDays`, `alternatives.formalSequential.workflowDesign.steps[1].queueDays`, `alternatives.formalSequential.workflowDesign.steps[2].activeDays`, `alternatives.formalSequential.workflowDesign.steps[2].queueDays`, `alternatives.formalSequential.workflowDesign.steps[3].activeDays`, `alternatives.formalSequential.workflowDesign.steps[3].queueDays`, `alternatives.formalSequential.workflowDesign.steps[4].activeDays`, `alternatives.formalSequential.workflowDesign.steps[4].queueDays`, `alternatives.formalSequential.workflowDesign.steps[5].activeDays`, `alternatives.formalSequential.workflowDesign.steps[5].queueDays`, `alternatives.formalSequential.workflowDesign.steps[6].activeDays`, `alternatives.formalSequential.workflowDesign.steps[6].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[6].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[6].queueDays`, `dailyCostOfInaction`
- `competition_transfer`: `alternatives.formalSequential.contractDesign.dimensions[0].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost`
- `contract_amendment`: `alternatives.formalSequential.contractDesign.dimensions[1].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost`
- `tco`: `alternatives.formalSequential.contractDesign.dimensions[2].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost`

### Non-monetised dimensions

- `informal_bypass`

### Migration status

- Native model 2.3 record

### Legal provenance

- None

## `discovery_solution_codesign`

### Cost comparison

- Difference operation: `formalSequential_minus_adaptiveCompliant`
- Central cost difference: -272224.17 PLN
- Outer difference range: -1277974.17 / 602650.83 PLN

### Coverage anchors

- `role_cost`: `alternatives.formalSequential.workflowDesign.steps[0].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[0].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[3].roleHours.manager`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.formalSequential.workflowDesign.steps[4].roleHours.finance`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[5].roleHours.executive`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.lawyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].roleHours.finance`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].roleHours.executive`, `roleHourlyRates.requestor`, `roleHourlyRates.buyer`, `roleHourlyRates.lawyer`, `roleHourlyRates.finance`, `roleHourlyRates.manager`, `roleHourlyRates.executive`
- `non_labour_cost`: `alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[2].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[3].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[4].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[5].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].nonLabourCost`
- `delay_cost`: `alternatives.formalSequential.workflowDesign.steps[0].activeDays`, `alternatives.formalSequential.workflowDesign.steps[0].queueDays`, `alternatives.formalSequential.workflowDesign.steps[1].activeDays`, `alternatives.formalSequential.workflowDesign.steps[1].queueDays`, `alternatives.formalSequential.workflowDesign.steps[2].activeDays`, `alternatives.formalSequential.workflowDesign.steps[2].queueDays`, `alternatives.formalSequential.workflowDesign.steps[3].activeDays`, `alternatives.formalSequential.workflowDesign.steps[3].queueDays`, `alternatives.formalSequential.workflowDesign.steps[4].activeDays`, `alternatives.formalSequential.workflowDesign.steps[4].queueDays`, `alternatives.formalSequential.workflowDesign.steps[5].activeDays`, `alternatives.formalSequential.workflowDesign.steps[5].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[3].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[4].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[5].queueDays`, `dailyCostOfInaction`
- `competition_transfer`: `alternatives.formalSequential.contractDesign.dimensions[0].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost`
- `contract_amendment`: `alternatives.formalSequential.contractDesign.dimensions[1].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost`
- `tco`: `alternatives.formalSequential.contractDesign.dimensions[2].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost`

### Non-monetised dimensions

- `informal_bypass`

### Migration status

- Native model 2.3 record

### Legal provenance

- None

## `catalog_calloff_control`

### Cost comparison

- Difference operation: `formalSequential_minus_adaptiveCompliant`
- Central cost difference: 0.00 PLN
- Outer difference range: -3937.50 / 3937.50 PLN

### Coverage anchors

- `role_cost`: `alternatives.formalSequential.workflowDesign.steps[0].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.requestor`, `alternatives.formalSequential.workflowDesign.steps[1].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.manager`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.manager`, `roleHourlyRates.requestor`, `roleHourlyRates.buyer`, `roleHourlyRates.lawyer`, `roleHourlyRates.finance`, `roleHourlyRates.manager`, `roleHourlyRates.executive`
- `non_labour_cost`: `alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[2].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].nonLabourCost`
- `delay_cost`: `alternatives.formalSequential.workflowDesign.steps[0].activeDays`, `alternatives.formalSequential.workflowDesign.steps[0].queueDays`, `alternatives.formalSequential.workflowDesign.steps[1].activeDays`, `alternatives.formalSequential.workflowDesign.steps[1].queueDays`, `alternatives.formalSequential.workflowDesign.steps[2].activeDays`, `alternatives.formalSequential.workflowDesign.steps[2].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].queueDays`, `dailyCostOfInaction`
- `competition_transfer`: `alternatives.formalSequential.contractDesign.dimensions[0].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost`
- `contract_amendment`: `alternatives.formalSequential.contractDesign.dimensions[1].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost`
- `tco`: `alternatives.formalSequential.contractDesign.dimensions[2].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost`

### Non-monetised dimensions

- `informal_bypass`

### Migration status

- Native model 2.3 record

### Legal provenance

- None

## `mrp_release_control`

### Cost comparison

- Difference operation: `formalSequential_minus_adaptiveCompliant`
- Central cost difference: 0.00 PLN
- Outer difference range: -42000.00 / 42000.00 PLN

### Coverage anchors

- `role_cost`: `alternatives.formalSequential.workflowDesign.steps[1].roleHours.buyer`, `alternatives.formalSequential.workflowDesign.steps[2].roleHours.requestor`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].roleHours.buyer`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].roleHours.requestor`, `roleHourlyRates.requestor`, `roleHourlyRates.buyer`, `roleHourlyRates.lawyer`, `roleHourlyRates.finance`, `roleHourlyRates.manager`, `roleHourlyRates.executive`
- `non_labour_cost`: `alternatives.formalSequential.workflowDesign.steps[0].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[1].nonLabourCost`, `alternatives.formalSequential.workflowDesign.steps[2].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].nonLabourCost`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].nonLabourCost`
- `delay_cost`: `alternatives.formalSequential.workflowDesign.steps[0].activeDays`, `alternatives.formalSequential.workflowDesign.steps[0].queueDays`, `alternatives.formalSequential.workflowDesign.steps[1].activeDays`, `alternatives.formalSequential.workflowDesign.steps[1].queueDays`, `alternatives.formalSequential.workflowDesign.steps[2].activeDays`, `alternatives.formalSequential.workflowDesign.steps[2].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[0].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[1].queueDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].activeDays`, `alternatives.adaptiveCompliant.workflowDesign.steps[2].queueDays`, `dailyCostOfInaction`
- `competition_transfer`: `alternatives.formalSequential.contractDesign.dimensions[0].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[0].cost`
- `contract_amendment`: `alternatives.formalSequential.contractDesign.dimensions[1].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[1].cost`
- `tco`: `alternatives.formalSequential.contractDesign.dimensions[2].cost`, `alternatives.adaptiveCompliant.contractDesign.dimensions[2].cost`

### Non-monetised dimensions

- `informal_bypass`

### Migration status

- Native model 2.3 record

### Legal provenance

- None
