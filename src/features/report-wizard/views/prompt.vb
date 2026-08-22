Option Explicit

Sub ColorPerformanceData()

    Const HEADER_ROW As Long = 3
    Const FIRST_DATA_ROW As Long = 4

    Dim ws As Worksheet
    Dim lastCell As Range
    Dim actualCell As Range
    Dim targetCell As Range
    Dim lastRow As Long
    Dim lastColumn As Long
    Dim rowNumber As Long
    Dim columnNumber As Long
    Dim actualNumber As Double
    Dim targetNumber As Double
    Dim headerText As String
    Dim previousHeader As String
    Dim fullHeader As String
    Dim cellsColored As Long

    Set ws = ActiveSheet

    Set lastCell = ws.Cells.Find( _
        What:="*", _
        After:=ws.Range("A1"), _
        LookIn:=xlFormulas, _
        LookAt:=xlPart, _
        SearchOrder:=xlByRows, _
        SearchDirection:=xlPrevious)

    If lastCell Is Nothing Then
        MsgBox "The worksheet is empty.", vbExclamation
        Exit Sub
    End If

    lastRow = lastCell.Row

    lastColumn = Application.Max( _
        ws.Cells(2, ws.Columns.Count).End(xlToLeft).Column, _
        ws.Cells(3, ws.Columns.Count).End(xlToLeft).Column)

    Application.ScreenUpdating = False
    On Error GoTo ErrorHandler

    For columnNumber = 1 To lastColumn

        headerText = CleanHeader(ws.Cells(HEADER_ROW, columnNumber).Value)

        If columnNumber > 1 Then
            previousHeader = CleanHeader( _
                ws.Cells(HEADER_ROW, columnNumber - 1).Value)
        Else
            previousHeader = ""
        End If

        '========================================
        ' TARGET AND ACTUAL COLUMN PAIRS
        '========================================
        If headerText = "ACTUAL" And previousHeader = "TARGET" Then

            For rowNumber = FIRST_DATA_ROW To lastRow

                Set actualCell = ws.Cells(rowNumber, columnNumber)
                Set targetCell = ws.Cells(rowNumber, columnNumber - 1)

                If Len(Trim(CStr(actualCell.Value))) > 0 Then

                    'Zero, dash or N/A is neutral
                    If IsNeutralValue(actualCell.Value) Then

                        ApplyFill actualCell, RGB(255, 192, 0)
                        cellsColored = cellsColored + 1

                    ElseIf TryGetNumber(actualCell.Value, actualNumber) Then

                        'An ACTUAL value of zero is neutral
                        If actualNumber = 0 Then

                            ApplyFill actualCell, RGB(255, 192, 0)

                        ElseIf TryGetNumber(targetCell.Value, targetNumber) Then

                            If actualNumber > targetNumber Then

                                'Actual is greater than Target
                                ApplyFill actualCell, RGB(0, 176, 80)

                            ElseIf actualNumber = targetNumber Then

                                'Actual is equal to Target
                                ApplyFill actualCell, RGB(255, 192, 0)

                            Else

                                'Actual is below Target
                                ApplyFill actualCell, RGB(255, 0, 0)

                            End If

                        Else
                            'Target is missing: assess as standalone data
                            If actualNumber > 0 Then
                                ApplyFill actualCell, RGB(0, 176, 80)
                            Else
                                ApplyFill actualCell, RGB(255, 0, 0)
                            End If

                        End If

                        cellsColored = cellsColored + 1
                    End If

                End If

            Next rowNumber

        Else
            '========================================
            ' COLUMNS WITHOUT TARGETS
            ' INTERNET AND TRAININGS
            '========================================
            fullHeader = GetFullHeader(ws, columnNumber, HEADER_ROW)

            If IsStandaloneColumn(fullHeader) Then

                For rowNumber = FIRST_DATA_ROW To lastRow

                    Set actualCell = ws.Cells(rowNumber, columnNumber)

                    If Len(Trim(CStr(actualCell.Value))) > 0 Then

                        If IsNeutralValue(actualCell.Value) Then

                            ApplyFill actualCell, RGB(255, 192, 0)
                            cellsColored = cellsColored + 1

                        ElseIf TryGetNumber(actualCell.Value, actualNumber) Then

                            If actualNumber > 0 Then
                                ApplyFill actualCell, RGB(0, 176, 80)
                            ElseIf actualNumber = 0 Then
                                ApplyFill actualCell, RGB(255, 192, 0)
                            Else
                                ApplyFill actualCell, RGB(255, 0, 0)
                            End If

                            cellsColored = cellsColored + 1
                        End If

                    End If

                Next rowNumber

            End If
        End If

    Next columnNumber

    Application.ScreenUpdating = True

    MsgBox cellsColored & " cells have been coloured.", _
           vbInformation, "Formatting Complete"

    Exit Sub

ErrorHandler:
    Application.ScreenUpdating = True

    MsgBox "The formatting could not be completed: " & _
           Err.Description, vbExclamation

End Sub


Private Sub ApplyFill(ByVal targetCell As Range, ByVal fillColor As Long)

    With targetCell.Interior
        .Pattern = xlSolid
        .Color = fillColor
    End With

End Sub


Private Function IsStandaloneColumn(ByVal headerText As String) As Boolean

    headerText = UCase(headerText)

    IsStandaloneColumn = _
        InStr(1, headerText, "INTERNET", vbTextCompare) > 0 Or _
        InStr(1, headerText, "TRAINING", vbTextCompare) > 0

End Function


Private Function GetFullHeader( _
    ByVal ws As Worksheet, _
    ByVal columnNumber As Long, _
    ByVal headerRow As Long) As String

    Dim upperHeader As String
    Dim lowerHeader As String

    upperHeader = CStr( _
        ws.Cells(headerRow - 1, columnNumber) _
        .MergeArea.Cells(1, 1).Value)

    lowerHeader = CStr( _
        ws.Cells(headerRow, columnNumber) _
        .MergeArea.Cells(1, 1).Value)

    GetFullHeader = CleanHeader(upperHeader & " " & lowerHeader)

End Function


Private Function CleanHeader(ByVal headerValue As Variant) As String

    Dim headerText As String

    headerText = UCase(Trim(CStr(headerValue)))
    headerText = Replace(headerText, Chr(160), " ")
    headerText = Replace(headerText, vbCr, " ")
    headerText = Replace(headerText, vbLf, " ")

    Do While InStr(headerText, "  ") > 0
        headerText = Replace(headerText, "  ", " ")
    Loop

    CleanHeader = Trim(headerText)

End Function


Private Function IsNeutralValue(ByVal cellValue As Variant) As Boolean

    Dim valueText As String

    If IsError(cellValue) Then Exit Function

    valueText = UCase(Trim(CStr(cellValue)))

    IsNeutralValue = _
        valueText = "-" Or _
        valueText = "–" Or _
        valueText = "—" Or _
        valueText = "N/A"

End Function


Private Function TryGetNumber( _
    ByVal cellValue As Variant, _
    ByRef result As Double) As Boolean

    Dim valueText As String
    Dim isNegative As Boolean

    If IsError(cellValue) Or IsEmpty(cellValue) Then Exit Function

    If IsNumeric(cellValue) Then
        result = CDbl(cellValue)
        TryGetNumber = True
        Exit Function
    End If

    valueText = Trim(CStr(cellValue))

    If valueText = "" Then Exit Function

    'Support numbers stored as text
    valueText = Replace(valueText, ",", "")
    valueText = Replace(valueText, "$", "")
    valueText = Replace(valueText, " ", "")

    'Support accounting-style negative numbers: (386)
    If Left(valueText, 1) = "(" And Right(valueText, 1) = ")" Then
        isNegative = True
        valueText = Mid(valueText, 2, Len(valueText) - 2)
    End If

    If IsNumeric(valueText) Then

        result = CDbl(valueText)

        If isNegative Then result = result * -1

        TryGetNumber = True
    End If

End Function