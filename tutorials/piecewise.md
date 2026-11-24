---
number: 5a1
title: Piecewise functions
description: Build functions from regions, periodic waves, and typed integers.
---

## Orientation

A piecewise function picks its rule by where the input lies. RiX writes one as
a literal: a header that names the variable, then arms that read
`region ? rule`. The first region that holds supplies the value, and a bare
last arm is the default.

Prerequisites: [Define and call](function-basics.html) and the betweenness
section of [Intervals](intervals.html). A region is a betweenness chain such as
`0:x:!1`, where `:!` is a strict link and `_:` or `:_` marks an unbounded end.

## A function in three pieces

The header `/x/` declares the variable. Each arm tests a region; the last arm
has no region, so it covers everything else.

```rix edu
Ramp := {?: /x/ _:x:!0 ? 0; 0:x:!1 ? x; 1 };
[Ramp(-3), Ramp(0), Ramp(1/2), Ramp(1), Ramp(9)] ##@ == [0, 0, 1/2, 1, 1];
```

`Ramp(1)` falls through to the default because `0:x:!1` excludes 1. Change
`:!1` to `:1` and predict which arm then answers at 1.

Without a default, an input that no region holds gives `_`:

```rix edu
Half := {?: /x/ 0:x:1 ? x };
[Half(1/2), Half(2)] ##@ == [1/2, _];
```

## Periodic waves

A region may use an integer. Declare it after `;` in the header and RiX finds
the integer that makes the region hold, so one arm describes every copy.

```rix edu
Saw    := {?: /x; n/ n:x:!n+1 ? x - n };
Square := {?: /x; n/ 2n:x:!2n+1 ? 1; -1 };
[Saw(7/2), Saw(-1/3), Square(5/2), Square(3/2)] ##@ == [1/2, 2/3, 1, -1];
```

For `Saw(7/2)` the region `n:x:!n+1` holds when n is 3, so the rule gives
`7/2 - 3`. The rule may use the integer in any way:

```rix edu
Alt := {?: /x; n/ n:x:!n+1 ? (-1)^n (x - n) };
Tri := {?: /x; n/ 2n:x:!2n+1 ? x - 2n; 2n+1:x:!2n+2 ? 2n+2 - x };
[Alt(3/2), Alt(5/2), Tri(1/2), Tri(3/2)] ##@ == [-1/2, 1/2, 1/2, 1/2];
```

The triangle wave needs two arms because a default cannot use `n`: only a
region fixes an integer.

:::challenge Waves practice
Write `Floor` so that `Floor(-7/3)` is `-3` and `Floor(5)` is `5`.

    Floor := {?: /x; n/ n:x:!n+1 ? n };
    [Floor(-7/3), Floor(5)]
:::

## Typed integers

An integer can carry types. `Natural` (0, 1, 2, ...), `Positive`, `Negative`,
`Even` and `Odd` are built in. Types chain, and `::!` excludes one.

```rix edu
SawPos := {?: /x; n::Natural/ n:x:!n+1 ? x - n };
PosOdd := {?: /x; n::Positive::!Even/ n:x:!n+1 ? n };
[SawPos(-1/2), SawPos(5/2), PosOdd(7/2), PosOdd(5/2)] ##@ == [_, 1/2, 3, _];
```

The same chains work in ordinary type checks:

```rix edu
[4 ? :Positive::Even, 3 ? :Positive::!Even, 0 ? :Positive] ##@ == [1, 1, _];
```

## Your own integer types (advanced)

`.IntegerType` defines a type by its shape: the remainders it allows modulo
some number, and optional bounds. RiX solves regions over shaped types exactly.

```rix edu
.IntegerType(:ThreeMod4, {= mod=4, residues=[3], min=0 });
T := {?: /x; n::ThreeMod4/ n:x:!n+1 ? n };
[T(7/2), T(15/2), T(8)] ##@ == [3, 7, _];
```

A second integer can follow the first: `m::Odd > n` is the least odd number
above `n`.

```rix edu
Step := {?: /x; n::Even, m::Odd > n/ n:x:!m ? 1; 0 };
[Step(1/2), Step(3/2), Step(-2)] ##@ == [1, 0, 1];
```

## Intervals and uncertain inputs (advanced)

An interval input splits at the breakpoints, applies each rule to its part,
and returns the hull. A certified value that straddles a breakpoint gives the
undecided value `?`.

```rix edu
Ramp := {?: /x/ _:x:!0 ? 0; 0:x:!1 ? x; 1 };
Saw  := {?: /x; n/ n:x:!n+1 ? x - n };
[Ramp(1/4:3/2), Saw(1/2:3/2), Saw(2.9?)] ##@ == [1/4:1, 0:1, ?];
```

`.Breaks` lists where the pieces meet:

```rix edu
Square := {?: /x; n/ 2n:x:!2n+1 ? 1; -1 };
.Breaks(Square, 0:3) ##@ == [0, 1, 2, 3];
```

## Two variables (advanced)

List several variables before the `;`. Regions on different variables combine
with `&&`.

```rix edu
Checker := {?: /x, y; n, m/ n:x:!n+1 && m:y:!m+1 ? (-1)^(n+m) };
Under   := {?: /x, y/ 0:x:1 && 0:y:x ? 1; 0 };
[Checker(1/2, 3/2), Checker(1/2, 1/2), Under(1/2, 1/4), Under(1/2, 3/4)] ##@ == [-1, 1, 1, 0];
```

Point values work for any region. Breakpoints and interval input for more than
one variable at a time are not implemented yet; see the
[piecewise reference](https://rix.ratmath.com/eval/piecewise.html) for the
full rules and what is still to come.
